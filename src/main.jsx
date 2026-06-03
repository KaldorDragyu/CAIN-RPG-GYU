
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import { supabase, isSupabaseConfigured } from './lib/supabaseClient'
import {
  agendas, adminPrinciples, binderThemes, blasphemies, categoryRows, conflictRules,
  creationSteps, exorcistRules, huntFlow, investigationSteps, kitCatalog, kitRules,
  legalNotice, navItems, opponentRules, powerTags, quickRules, sinCore, sinMarks,
  sinTypes, skills, sourceMap, tensionMoves
} from './data/content'

const clamp = (n, min, max) => Math.max(min, Math.min(max, Number(n) || 0))
const rollD6 = () => Math.floor(Math.random() * 6) + 1
const rollD3 = () => Math.ceil(rollD6() / 2)

function Ref({ children }) { return <span className="ref">Livro {children}</span> }
function Card({ title, ref, children, className = '' }) { return <article className={`card ${className}`}><div className="card-head"><h3>{title}</h3>{ref && <Ref>{ref}</Ref>}</div>{children}</article> }
function List({ items }) { return <ul className="clean-list">{items.map((item, i) => <li key={i}>{item}</li>)}</ul> }
function SectionTitle({ eyebrow, title, children }) { return <div className="section-title"><p className="eyebrow">{eyebrow}</p><h2>{title}</h2>{children && <p>{children}</p>}</div> }


const ROLE_NAV = {
  guest: ['home', 'rules', 'creation', 'agendas', 'blasphemies', 'kit', 'login'],
  player: ['home', 'rules', 'creation', 'agendas', 'blasphemies', 'kit', 'hunt', 'tools', 'sheet', 'profile'],
  master: ['home', 'rules', 'creation', 'agendas', 'blasphemies', 'kit', 'hunt', 'admin', 'sins', 'opponents', 'tools', 'sheet', 'profile']
}
const extraNav = [{ id: 'profile', label: 'Perfil' }, { id: 'login', label: 'Login' }]
const getNavForRole = role => {
  const ids = ROLE_NAV[role || 'guest'] || ROLE_NAV.guest
  const all = [...navItems, ...extraNav]
  return ids.map(id => all.find(item => item.id === id)).filter(Boolean)
}
const roleName = role => role === 'master' ? 'Mestre' : role === 'player' ? 'Player' : 'Guest'

const personIcon = '☻'
const phoneTabLabels = { inbox: 'Caixa de entrada', notes: 'Bloco de notas', friends: 'Contatos', chat: 'Chat interno', profile: 'Perfil do agente', master: 'Console do Mestre' }
function openPhoneTab(setActive, tab = 'inbox') {
  localStorage.setItem('cain-phone-open-tab', tab)
  setActive('profile')
}
function useMiniProfile(auth) {
  const [profile, setProfile] = useState(null)
  const [unread, setUnread] = useState(0)
  const userId = auth.user?.id || auth.user?.email
  async function refresh() {
    if (!userId || auth.role === 'guest') return
    if (auth.supabaseReady && supabase) {
      const [{ data: prof }, { data: inbox }] = await Promise.all([
        supabase.from('profiles').select('id,email,display_name,role,avatar_url,character_name,organization_title').eq('id', userId).maybeSingle(),
        supabase.from('inbox_messages').select('id,is_read').eq('user_id', userId).eq('is_read', false)
      ])
      setProfile(prof || null)
      setUnread((inbox || []).length)
    } else {
      try {
        const data = JSON.parse(localStorage.getItem(HUB_LOCAL_KEY)) || {}
        setProfile((data.profiles || []).find(p => p.id === userId) || null)
        setUnread(((data.inbox || {})[userId] || []).filter(m => !m.is_read).length)
      } catch { setProfile(null); setUnread(0) }
    }
  }
  useEffect(() => {
    refresh()
    if (!userId || auth.role === 'guest') return
    const t = setInterval(refresh, 5000)
    return () => clearInterval(t)
  }, [userId, auth.role, auth.supabaseReady])
  return { profile, unread, refresh }
}
function ProfileMenu({ auth, setActive }) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)
  const mini = useMiniProfile(auth)
  const profile = mini.profile || {}
  const label = profile.character_name || profile.display_name || auth.user?.name || 'Agente'
  useEffect(() => {
    const close = e => { if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])
  if (auth.role === 'guest') return <div className="top-actions"><button className="ghost" onClick={() => setActive('login')}>Entrar</button></div>
  const jump = tab => { setOpen(false); openPhoneTab(setActive, tab) }
  return <div className="profile-menu" ref={menuRef}>
    <button className="profile-trigger" onClick={() => setOpen(!open)} title="Abrir Celular CAIN">
      <span className="profile-avatar-small">{profile.avatar_url ? <img src={profile.avatar_url} alt={label} /> : <span className="person-icon">{personIcon}</span>}</span>
      <span className="profile-trigger-text"><strong>{label}</strong><small>{auth.role === 'master' ? 'Mestre' : 'Agente'}</small></span>
      {mini.unread > 0 && <span className="unread-dot">{mini.unread}</span>}
      <span className="hamburger-lines"><i></i><i></i><i></i></span>
    </button>
    {open && <div className="phone-dropdown">
      <div className="phone-dropdown-head">
        <div className="profile-avatar-large">{profile.avatar_url ? <img src={profile.avatar_url} alt={label} /> : <span className="person-icon">{personIcon}</span>}</div>
        <div><p className="eyebrow">{profile.organization_title || 'CAIN // Célula GYU'}</p><h3>{label}</h3><small>{auth.user?.email}</small></div>
      </div>
      <div className="phone-menu-grid">
        <button onClick={() => jump('inbox')}>▣ <span>Caixa</span>{mini.unread > 0 && <b>{mini.unread}</b>}</button>
        <button onClick={() => jump('notes')}>✎ <span>Notas</span></button>
        <button onClick={() => jump('friends')}>◇ <span>Contatos</span></button>
        <button onClick={() => jump('chat')}>◌ <span>Chat</span></button>
        <button onClick={() => jump('profile')}>☻ <span>Perfil</span></button>
        <button onClick={() => { setOpen(false); setActive('sheet') }}>▰ <span>Ficha</span></button>
        {auth.role === 'master' && <button onClick={() => jump('master')}>⌁ <span>Mestre</span></button>}
      </div>
      <div className="phone-dropdown-actions"><button className="danger" onClick={() => { setOpen(false); auth.logout() }}>Sair da operação</button></div>
    </div>}
  </div>
}
function useUnreadNotice(auth) {
  const [notice, setNotice] = useState(null)
  const userId = auth.user?.id || auth.user?.email
  async function check() {
    if (!userId || auth.role !== 'player') return
    let newest = null
    if (auth.supabaseReady && supabase) {
      const { data } = await supabase.from('inbox_messages').select('*').eq('user_id', userId).eq('is_read', false).order('created_at', { ascending: false }).limit(1)
      newest = data?.[0]
    } else {
      try {
        const d = JSON.parse(localStorage.getItem(HUB_LOCAL_KEY)) || {}
        newest = ((d.inbox || {})[userId] || []).filter(m => !m.is_read).sort((a,b)=>String(b.created_at).localeCompare(String(a.created_at)))[0]
      } catch {}
    }
    if (newest) {
      const seenKey = `cain-last-notice-${userId}`
      if (localStorage.getItem(seenKey) !== newest.id) setNotice(newest)
    }
  }
  useEffect(() => {
    check()
    if (!userId || auth.role !== 'player') return
    const t = setInterval(check, auth.supabaseReady ? 3500 : 3000)
    return () => clearInterval(t)
  }, [userId, auth.role, auth.supabaseReady])
  const dismiss = () => { if (notice && userId) localStorage.setItem(`cain-last-notice-${userId}`, notice.id); setNotice(null) }
  return { notice, dismiss }
}
function InboxToast({ auth, setActive }) {
  const { notice, dismiss } = useUnreadNotice(auth)
  if (!notice) return null
  return <div className="inbox-toast">
    <div><p className="eyebrow">Nova ordem recebida</p><h3>{notice.subject}</h3><p>{notice.from_name || 'CAIN'} enviou uma atualização para sua caixa de entrada.</p></div>
    <div className="sheet-actions"><button className="primary" onClick={() => { dismiss(); openPhoneTab(setActive, 'inbox') }}>Abrir caixa</button><button className="ghost" onClick={dismiss}>Depois</button></div>
  </div>
}


function useAuth() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cain-auth-session')) || { role: 'guest', mode: 'guest' } }
    catch { return { role: 'guest', mode: 'guest' } }
  })
  const [loading, setLoading] = useState(Boolean(isSupabaseConfigured))
  const [message, setMessage] = useState('')

  useEffect(() => {
    let alive = true
    async function bootSupabase() {
      if (!isSupabaseConfigured || !supabase) { setLoading(false); return }
      const { data } = await supabase.auth.getSession()
      if (!alive) return
      if (data?.session?.user) await hydrateSupabaseUser(data.session.user)
      else { setUser({ role: 'guest', mode: 'guest' }); localStorage.removeItem('cain-auth-session') }
      setLoading(false)
    }
    bootSupabase()
    if (!isSupabaseConfigured || !supabase) return () => { alive = false }
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) hydrateSupabaseUser(session.user)
      else { setUser({ role: 'guest', mode: 'guest' }); localStorage.removeItem('cain-auth-session') }
    })
    return () => { alive = false; sub?.subscription?.unsubscribe?.() }
  }, [])

  async function hydrateSupabaseUser(rawUser) {
    if (!supabase) return
    let profile = null
    const { data, error } = await supabase.from('profiles').select('*').eq('id', rawUser.id).maybeSingle()
    if (!error && data) profile = data
    if (!profile) {
      const fallbackRole = import.meta.env.VITE_MASTER_EMAIL && rawUser.email?.toLowerCase() === import.meta.env.VITE_MASTER_EMAIL.toLowerCase() ? 'master' : 'player'
      const { data: created } = await supabase.from('profiles').upsert({
        id: rawUser.id,
        email: rawUser.email,
        display_name: rawUser.user_metadata?.display_name || rawUser.email?.split('@')[0] || 'Exorcista',
        role: fallbackRole
      }).select('*').maybeSingle()
      profile = created
    }
    const next = {
      id: rawUser.id,
      email: rawUser.email,
      name: profile?.display_name || rawUser.user_metadata?.display_name || rawUser.email,
      role: profile?.role || 'player',
      mode: 'supabase'
    }
    setUser(next)
    localStorage.setItem('cain-auth-session', JSON.stringify(next))
  }

  function localUsers() { try { return JSON.parse(localStorage.getItem('cain-local-users')) || {} } catch { return {} } }
  function saveLocalUsers(users) { localStorage.setItem('cain-local-users', JSON.stringify(users)) }

  async function login(email, password) {
    setMessage('')
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) { setMessage(error.message); return false }
      return true
    }
    const users = localUsers()
    const found = users[email.toLowerCase()]
    if (!found || found.password !== password) { setMessage('Email ou senha inválidos.'); return false }
    const next = { id: found.id || key, email: found.email, name: found.name, role: found.role, mode: 'local' }
    setUser(next); localStorage.setItem('cain-auth-session', JSON.stringify(next)); return true
  }

  async function register({ email, password, name, role = 'player' }) {
    setMessage('')
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { display_name: name || email.split('@')[0] } } })
      if (error) { setMessage(error.message); return false }
      if (data?.user) {
        await supabase.from('profiles').upsert({ id: data.user.id, email, display_name: name || email.split('@')[0], role: 'player' })
        setMessage('Conta criada. Você já pode tentar entrar com seu email e senha.')
      }
      return true
    }
    const users = localUsers()
    const key = email.toLowerCase()
    users[key] = { id: key, email, password, name: name || email.split('@')[0], role }
    saveLocalUsers(users)
    setMessage('Conta criada. Você já pode entrar.')
    return true
  }

  function seedLocalUsers() {
    setMessage('Criação de contas de demonstração desativada nesta versão.')
  }

  async function logout() {
    if (isSupabaseConfigured && supabase) await supabase.auth.signOut()
    localStorage.removeItem('cain-auth-session')
    setUser({ role: 'guest', mode: 'guest' })
  }

  function continueAsGuest() { setUser({ role: 'guest', mode: 'guest' }); localStorage.removeItem('cain-auth-session') }
  return { user, role: user?.role || 'guest', loading, message, setMessage, login, register, seedLocalUsers, logout, continueAsGuest, supabaseReady: isSupabaseConfigured }
}

function App() {
  const auth = useAuth()
  const [active, setActive] = useState(() => auth.role === 'guest' ? 'login' : 'home')
  const [query, setQuery] = useState('')
  const allowedNav = getNavForRole(auth.role)
  const allowedIds = allowedNav.map(i => i.id)

  useEffect(() => {
    if (!allowedIds.includes(active)) setActive(auth.role === 'guest' ? 'login' : 'home')
  }, [auth.role, active])

  const activeLabel = [...navItems, ...extraNav].find(i => i.id === active)?.label ?? 'CAIN'
  const page = useMemo(() => ({
    home: <Home setActive={setActive} auth={auth} />,
    rules: <RulesPage />,
    creation: <CreationPage />,
    agendas: <AgendasPage query={query} />,
    blasphemies: <BlasphemiesPage query={query} />,
    kit: <KitPage />,
    hunt: <LiveHuntPage auth={auth} />,
    admin: auth.role === 'master' ? <AdminPage /> : <Restricted auth={auth} setActive={setActive} />,
    sins: auth.role === 'master' ? <SinsPage query={query} /> : <Restricted auth={auth} setActive={setActive} />,
    opponents: auth.role === 'master' ? <OpponentsPage /> : <Restricted auth={auth} setActive={setActive} />,
    tools: auth.role === 'guest' ? <Restricted auth={auth} setActive={setActive} /> : <ToolsPage />,
    sheet: auth.role === 'guest' ? <Restricted auth={auth} setActive={setActive} /> : <CharacterSheet />,
    profile: auth.role === 'guest' ? <Restricted auth={auth} setActive={setActive} /> : <PlayerPhonePage auth={auth} />,
    login: <AuthPage auth={auth} setActive={setActive} />
  }[active] || <Home setActive={setActive} auth={auth} />), [active, query, auth.role, auth.user?.email, auth.message])

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand-block"><div className="triangle-mark">▽</div><p className="eyebrow">Wipe out the stain</p><h1>CAIN 1.3</h1><p>Referência PT-BR de mesa</p></div>
      <nav>{allowedNav.map(item => <button key={item.id} className={active === item.id ? 'active' : ''} onClick={() => setActive(item.id)}>{item.label}</button>)}</nav>
      <div className="sidebar-note"><strong>Busca rápida</strong><input value={query} onChange={e => setQuery(e.target.value)} placeholder="agenda, poder, sin..." /></div>
      <div className="sidebar-note session-note"><strong>{roleName(auth.role)}</strong><span>{auth.user?.email || 'Acesso sem login'}</span>{auth.role !== 'guest' ? <button className="ghost" onClick={auth.logout}>Sair</button> : <button className="ghost" onClick={() => setActive('login')}>Entrar</button>}</div>
    </aside>
    <main>
      <header className="topbar"><div><p className="eyebrow">Aba atual</p><h2>{activeLabel}</h2></div><ProfileMenu auth={auth} setActive={setActive} /></header>
      <InboxToast auth={auth} setActive={setActive} />
      {auth.loading ? <section className="stack gap-lg"><Card title="Carregando autenticação"><p>Conectando...</p></Card></section> : page}
      <footer><p>{legalNotice}</p></footer>
    </main>
  </div>
}

function Restricted({ auth, setActive }) {
  return <section className="stack gap-lg"><SectionTitle eyebrow="Acesso restrito" title="Faça login para usar esta área" >Guests podem consultar as regras abertas. A ficha e a caçada ao vivo ficam para players e mestre.</SectionTitle><Card title="Entrar na operação"><p>Use login de Player para criar ficha e acompanhar a missão, ou login de Mestre para controlar NPCs, inimigos, aliados, tensão e pressão.</p><button className="primary" onClick={() => setActive('login')}>Ir para Login</button>{auth.role !== 'guest' && <p className="muted">Seu perfil atual não tem permissão para essa aba.</p>}</Card></section>
}


function AuthPage({ auth, setActive }) {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState('player')
  async function submit(e) {
    e.preventDefault()
    const ok = mode === 'login'
      ? await auth.login(email, password)
      : await auth.register({ email, password, name, role: 'player' })
    if (ok && mode === 'login') setActive('home')
  }
  return <section className="stack gap-lg">
    <SectionTitle eyebrow="Acesso à operação" title="Login de Mestre, Player ou Guest">Guest vê só as regras abertas. Player cria ficha e acompanha a missão. Mestre controla caçada, NPCs, aliados e inimigos.</SectionTitle>
    <div className="grid two">
      <Card title={mode === 'login' ? 'Entrar' : 'Criar conta'}>
        <form className="form-grid single" onSubmit={submit}>
          {mode === 'register' && <label>Nome / codinome<input value={name} onChange={e => setName(e.target.value)} placeholder="Vergil, Nero, etc." /></label>}
          <label>Email do exorcista<input value={email} onChange={e => setEmail(e.target.value)} placeholder="seu.codinome@cain.com" /></label>
          <label>Senha<input type="password" value={password} onChange={e => setPassword(e.target.value)} /></label>
          <div className="sheet-actions"><button className="primary" type="submit">{mode === 'login' ? 'Entrar' : 'Criar conta'}</button><button className="ghost" type="button" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>{mode === 'login' ? 'Criar conta de player' : 'Voltar ao login'}</button><button className="ghost" type="button" onClick={() => { auth.continueAsGuest(); setActive('rules') }}>Acessar como Guest</button></div>
        </form>
        {auth.message && <p className="warning">{auth.message}</p>}
      </Card>
      <Card title="Acesso dos jogadores">
        <div className="stat-grid"><div><span>Perfil atual</span><strong>{roleName(auth.role)}</strong></div><div><span>Modo</span><strong>{auth.role === 'guest' ? 'Visitante' : 'Operação ativa'}</strong></div></div>
        <p>Entre com o email/codinome e senha combinados com o Mestre. Como Player, você acessa ficha, regras, Celular CAIN e informações públicas da missão.</p>
        <p className="muted">Caso ainda não tenha conta, crie uma conta de Player e avise o Mestre para liberar as mensagens iniciais da operação.</p>
      </Card>
    </div>
  </section>
}

const CAMPAIGN_KEY = 'cain-live-campaign-state-v2'
const actorTypeLabels = { npc: 'NPC', ally: 'Aliado', player: 'Exorcista', enemy: 'Inimigo', boss: 'Boss' }
const hostileTypes = ['enemy', 'boss']
const isHostileType = type => hostileTypes.includes(type)
const actorTypeDefaults = type => ({
  npc: { name: 'NPC sem nome', visible: true, category: 0, executionMax: 0, icon: '◇' },
  ally: { name: 'Aliado sem nome', visible: true, category: 0, executionMax: 0, icon: '◆' },
  player: { name: 'Exorcista sem nome', visible: true, category: 1, executionMax: 0, icon: '△' },
  enemy: { name: 'Pecado sem nome', visible: false, category: 2, executionMax: 10, icon: '☠' },
  boss: { name: 'Boss sem nome', visible: false, category: 4, executionMax: 14, icon: '☠' }
}[type] || { name: 'NPC sem nome', visible: true, category: 0, executionMax: 0, icon: '◇' })
const newActor = (type = 'npc') => {
  const defaults = actorTypeDefaults(type)
  return { id: crypto.randomUUID(), type, name: defaults.name, subtitle: '', image: '', imageFit: 'contain', visible: defaults.visible, status: 'Ativo', publicInfo: '', privateInfo: '', category: defaults.category, stress: 0, maxStress: 6, injuries: 0, execution: 0, executionMax: defaults.executionMax, dead: false }
}
const oneShotCampaign = () => {
  const marco = newActor('npc')
  Object.assign(marco, {
    name: 'Marco Kirstein',
    subtitle: 'Morador local / contato inicial',
    visible: true,
    status: 'Aguardando contato',
    publicInfo: 'Marco solicitou discrição total. Ele afirma que pessoas conhecidas foram vistas em dois lugares ao mesmo tempo e que vozes familiares têm chamado moradores para fora depois do anoitecer.',
    privateInfo: 'Marco sabe mais do que contou. Ele teme ser desacreditado e evita falar sobre o último desaparecimento perto da propriedade antiga.',
    imageFit: 'contain'
  })
  const sheriff = newActor('npc')
  Object.assign(sheriff, {
    name: 'Agente Helena Duarte',
    subtitle: 'Autoridade local',
    visible: true,
    status: 'Cooperativa, mas tensa',
    publicInfo: 'Responsável por manter curiosos afastados. Entrega os registros de ocorrência se os exorcistas demonstrarem credenciais convincentes.',
    privateInfo: 'Ela já viu algo usando a voz de um parente morto. Está escondendo o próprio medo.',
    imageFit: 'contain'
  })
  const witness = newActor('npc')
  Object.assign(witness, {
    name: 'Testemunha não identificada',
    subtitle: 'Paciente em observação',
    visible: false,
    status: 'Em choque',
    publicInfo: 'Uma testemunha foi encontrada em estado catatônico perto da estrada velha.',
    privateInfo: 'Quando pressionada, repete: “não era ele, mas usava a voz dele”.',
    imageFit: 'contain'
  })
  const boss = newActor('boss')
  Object.assign(boss, {
    name: 'Anomalia de Campo',
    subtitle: 'Alvo não classificado',
    visible: false,
    status: 'Não revelado',
    category: 3,
    executionMax: 10,
    publicInfo: 'A existência do alvo ainda não foi confirmada para a equipe.',
    privateInfo: 'Nunca diga o nome real do conceito para os jogadores. Use sinais: vozes imitadas, pegadas contraditórias, cheiro de animal molhado, reflexos errados e pessoas duplicadas. Antes de 2 pistas-chave, ataques contra ele são Hard. A execução só deve ser possível no local contaminado.',
    imageFit: 'contain'
  })
  return {
    id: 'main',
    version: 4,
    orgName: 'CAIN // Célula GYU',
    logo: '',
    missionTitle: 'Operação Vozes na Linha',
    missionCode: 'DOCREF GYU-0107',
    status: 'Briefing',
    introPublic: 'A célula foi convocada para uma ocorrência rural de baixa exposição pública. O caso envolve desaparecimentos, relatos contraditórios e registros impossíveis de presença simultânea.',
    briefingPublic: 'Ponto de encontro: posto desativado na estrada velha, 21h40. Contato inicial: Marco Kirstein. Objetivos iniciais: confirmar a anomalia, proteger civis, coletar evidências e localizar o centro da contaminação. Não confiem apenas em vozes, chamadas ou aparências familiares.',
    briefingPrivate: 'Estrutura para o Mestre: mantenha o alvo como enigma. Use Marco como gancho inicial, Helena como autoridade tensa e a testemunha como pista opcional. Pistas-chave sugeridas: 1) pessoa vista em dois lugares; 2) voz de alguém ausente chamando do escuro; 3) pegadas humanas que mudam de padrão; 4) câmera/áudio com atraso impossível. Com 2 pistas, a equipe entende como se proteger; com 3, a execução fica viável.',
    showTrackers: true,
    tension: { name: 'Tensão', value: 0, max: 3 },
    pressure: { name: 'Pressão', value: 0, max: 6 },
    actors: [marco, sheriff, witness, boss],
    logs: [
      { id: crypto.randomUUID(), public: true, at: new Date().toLocaleString(), text: 'CAIN confirmou ruído psíquico instável na região. A equipe deve evitar exposição civil.' },
      { id: crypto.randomUUID(), public: true, at: new Date().toLocaleString(), text: 'O contato Marco Kirstein aguardará a equipe no posto desativado da estrada velha.' },
      { id: crypto.randomUUID(), public: false, at: new Date().toLocaleString(), text: 'Não revele a natureza do alvo. Construa o horror por contradições, imitação e pistas físicas.' }
    ]
  }
}

const defaultCampaign = () => oneShotCampaign()

function useCampaign(auth) {
  const [campaign, setCampaign] = useState(() => { try { return { ...defaultCampaign(), ...(JSON.parse(localStorage.getItem(CAMPAIGN_KEY)) || {}) } } catch { return defaultCampaign() } })
  const [status, setStatus] = useState('')
  const [lastSync, setLastSync] = useState('')
  const [realtimeStatus, setRealtimeStatus] = useState('auto-sinc ligando...')
  const refreshingRef = useRef(false)
  const canWrite = auth.role === 'master'

  useEffect(() => { refresh(false) }, [auth.role, auth.user?.id])

  useEffect(() => {
    if (auth.role === 'guest') return
    // Players recebem atualização automática.
    // Mestre não recebe refresh automático enquanto edita, para não apagar letras durante a digitação.
    if (auth.role === 'master') {
      setRealtimeStatus('edição manual do Mestre')
      return
    }
    const interval = setInterval(() => refresh(true), auth.supabaseReady ? 5000 : 4000)
    if (!auth.supabaseReady || !supabase) return () => clearInterval(interval)

    const onChange = () => refresh(true)
    const channel = supabase.channel('cain-campaign-state-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'campaign_state', filter: 'id=eq.main' }, onChange)
      .subscribe(state => setRealtimeStatus(state === 'SUBSCRIBED' ? 'tempo real ativo' : 'auto-sinc ativo'))

    return () => { clearInterval(interval); supabase.removeChannel(channel) }
  }, [auth.supabaseReady, auth.role, auth.user?.id])

  async function refresh(silent = false) {
    if (refreshingRef.current) return
    refreshingRef.current = true
    try {
      if (auth.supabaseReady && supabase && auth.role !== 'guest') {
        const { data, error } = await supabase.from('campaign_state').select('data').eq('id', 'main').maybeSingle()
        if (!error && data?.data) {
          const next = { ...defaultCampaign(), ...data.data }
          setCampaign(next)
          localStorage.setItem(CAMPAIGN_KEY, JSON.stringify(next))
          setLastSync(new Date().toLocaleTimeString())
          if (!silent) setStatus('Missão sincronizada.')
          return
        }
        if (canWrite) await save(defaultCampaign(), 'Estado inicial criado.')
        else if (!silent && error) setStatus(`Erro ao atualizar: ${error.message}`)
      } else {
        try { setCampaign({ ...defaultCampaign(), ...(JSON.parse(localStorage.getItem(CAMPAIGN_KEY)) || {}) }) } catch { setCampaign(defaultCampaign()) }
        setLastSync(new Date().toLocaleTimeString())
      }
    } finally {
      refreshingRef.current = false
    }
  }

  async function save(next, okMessage = 'Salvo.') {
    const payload = { ...next, version: 3, updatedAt: new Date().toISOString() }
    setCampaign(payload)
    localStorage.setItem(CAMPAIGN_KEY, JSON.stringify(payload))
    setLastSync(new Date().toLocaleTimeString())
    if (auth.supabaseReady && supabase && canWrite) {
      const { error } = await supabase.from('campaign_state').upsert({ id: 'main', data: payload, updated_at: new Date().toISOString() })
      setStatus(error ? `Erro ao salvar: ${error.message}` : okMessage)
    } else setStatus(okMessage)
  }
  function update(updater, okMessage) {
    if (!canWrite) return setStatus('Apenas o Mestre pode alterar a caçada.')
    const next = typeof updater === 'function' ? updater(campaign) : { ...campaign, ...updater }
    save(next, okMessage)
  }
  return { campaign, update, refresh, status, canWrite, lastSync, realtimeStatus }
}

function readImageFile(file, cb) {
  if (!file) return
  if (file.size > 900000) { alert('Imagem muito grande. Use uma imagem menor que 900 KB ou cole uma URL.'); return }
  const reader = new FileReader()
  reader.onload = () => cb(reader.result)
  reader.readAsDataURL(file)
}

function CommitInput({ value = '', onCommit, type = 'text', placeholder = '', min, max, className = '' }) {
  const [draft, setDraft] = useState(value ?? '')
  const [focused, setFocused] = useState(false)
  useEffect(() => { if (!focused) setDraft(value ?? '') }, [value, focused])
  const commit = () => {
    setFocused(false)
    if (String(draft ?? '') !== String(value ?? '')) onCommit?.(draft)
  }
  return <input className={className} type={type} min={min} max={max} value={draft} placeholder={placeholder} onFocus={() => setFocused(true)} onChange={e => setDraft(e.target.value)} onBlur={commit} onKeyDown={e => { if (e.key === 'Enter' && type !== 'textarea') e.currentTarget.blur() }} />
}

function CommitTextarea({ value = '', onCommit, placeholder = '' }) {
  const [draft, setDraft] = useState(value ?? '')
  const [focused, setFocused] = useState(false)
  useEffect(() => { if (!focused) setDraft(value ?? '') }, [value, focused])
  const commit = () => {
    setFocused(false)
    if (String(draft ?? '') !== String(value ?? '')) onCommit?.(draft)
  }
  return <textarea value={draft} placeholder={placeholder} onFocus={() => setFocused(true)} onChange={e => setDraft(e.target.value)} onBlur={commit} />
}


function LiveHuntPage({ auth }) {
  const store = useCampaign(auth)
  if (auth.role === 'guest') return <section className="stack gap-lg"><SectionTitle eyebrow="Caçada" title="Acesso de missão bloqueado">Entre como Player ou Mestre para ver o início da missão, NPCs revelados e painel de sessão.</SectionTitle><HuntRulesReference /></section>
  return <section className="stack gap-lg">
    <SectionTitle eyebrow="Caçada ao vivo" title={auth.role === 'master' ? 'Painel do Mestre' : 'Dossiê do Player'}>{auth.role === 'master' ? 'Controle briefing, NPCs, aliados, inimigos, tensão, pressão e registros públicos.' : 'Veja o briefing liberado, NPCs revelados e andamento da missão.'}</SectionTitle>
    {store.status && <div className="result-box"><strong>Status:</strong> {store.status}</div>}
    {auth.role === 'master' ? <MasterHuntPanel store={store} /> : <PlayerHuntPanel store={store} />}
    <HuntRulesReference />
  </section>
}

function HuntHeader({ campaign }) {
  return <div className="mission-header">{campaign.logo ? <img src={campaign.logo} alt="Logo da organização" /> : <div className="mission-logo">▽</div>}<div><p className="eyebrow">{campaign.missionCode}</p><h2>{campaign.missionTitle}</h2><p><strong>{campaign.orgName}</strong> — {campaign.status}</p><p>{campaign.introPublic}</p></div></div>
}

function MasterHuntPanel({ store }) {
  const { campaign, update, refresh, lastSync, realtimeStatus } = store
  const [actorType, setActorType] = useState('npc')
  const [logText, setLogText] = useState('')
  const actorUpdate = (id, patch) => update(c => ({ ...c, actors: c.actors.map(a => a.id === id ? { ...a, ...patch } : a) }), 'Ator atualizado.')
  const addActor = () => update(c => ({ ...c, actors: [...c.actors, newActor(actorType)] }), 'Ator adicionado.')
  const deleteActor = id => update(c => ({ ...c, actors: c.actors.filter(a => a.id !== id) }), 'Ator removido.')
  const addLog = (publicLog = true) => { if (!logText.trim()) return; update(c => ({ ...c, logs: [{ id: crypto.randomUUID(), text: logText.trim(), public: publicLog, at: new Date().toLocaleString() }, ...(c.logs || [])].slice(0, 60) }), 'Registro adicionado.'); setLogText('') }
  const tickTension = () => update(c => { let tension = { ...c.tension, value: Number(c.tension.value || 0) + 1 }, pressure = { ...c.pressure }; let logs = [...(c.logs || [])]; if (tension.value >= Number(tension.max || 3)) { tension.value = 0; pressure.value = Math.min(Number(pressure.max || 6), Number(pressure.value || 0) + 1); logs.unshift({ id: crypto.randomUUID(), text: 'A Tensão encheu: a Pressão aumentou em +1.', public: true, at: new Date().toLocaleString() }) } return { ...c, tension, pressure, logs } }, 'Tensão atualizada.')
  const setTracker = (which, patch) => update(c => ({ ...c, [which]: { ...c[which], ...patch } }), 'Talismã atualizado.')
  return <div className="stack gap-lg">
    <HuntHeader campaign={campaign} />
    <div className="sync-strip"><span className="live-dot" /> <strong>{store.canWrite ? 'Sincronização:' : 'Sincronização automática:'}</strong> {realtimeStatus || 'ativa'} {lastSync && <small>Última atualização: {lastSync}</small>} <button className="ghost mini-button" onClick={() => refresh(false)}>Atualizar agora</button></div>
    <div className="grid two"><Card title="Configuração da missão"><div className="form-grid"><label>Organização<CommitInput value={campaign.orgName} onCommit={v => update({ orgName: v }, 'Organização salva.')} /></label><label>Código<CommitInput value={campaign.missionCode} onCommit={v => update({ missionCode: v }, 'Código salvo.')} /></label><label>Título da missão<CommitInput value={campaign.missionTitle} onCommit={v => update({ missionTitle: v }, 'Título salvo.')} /></label><label>Status<select value={campaign.status} onChange={e => update({ status: e.target.value })}><option>Briefing</option><option>Investigação</option><option>Preparação</option><option>Conflito</option><option>Execução</option><option>Exfiltração</option><option>Encerrada</option></select></label><label>Logo por URL<CommitInput value={campaign.logo || ''} onCommit={v => update({ logo: v }, 'Logo salva.')} placeholder="https://..." /></label><label>Upload de logo<input type="file" accept="image/*" onChange={e => readImageFile(e.target.files?.[0], data => update({ logo: data }, 'Logo atualizada.'))} /></label><label className="check"><input type="checkbox" checked={!!campaign.showTrackers} onChange={e => update({ showTrackers: e.target.checked })} /> Mostrar Tensão/Pressão aos players</label></div><label>Texto de abertura para players<CommitTextarea value={campaign.introPublic} onCommit={v => update({ introPublic: v }, 'Abertura salva.')} /></label><label>Briefing público<CommitTextarea value={campaign.briefingPublic} onCommit={v => update({ briefingPublic: v }, 'Briefing salvo.')} /></label><label>Notas secretas do Mestre<CommitTextarea value={campaign.briefingPrivate} onCommit={v => update({ briefingPrivate: v }, 'Notas secretas salvas.')} /></label><div className="sheet-actions"><button className="ghost" onClick={refresh}>Atualizar do banco</button><button className="primary" onClick={() => update(oneShotCampaign(), 'Missão base carregada.')}>Carregar missão base</button></div><p className="muted">Campos de texto salvam ao sair do campo. Imagens e botões salvam na hora.</p></Card>
    <Card title="Tensão e Pressão"><TrackerControl title="Tensão" tracker={campaign.tension} onChange={patch => setTracker('tension', patch)} /><TrackerControl title="Pressão" tracker={campaign.pressure} onChange={patch => setTracker('pressure', patch)} /><div className="sheet-actions"><button className="primary" onClick={tickTension}>Marcar +1 Tensão</button><button className="ghost" onClick={() => setTracker('tension', { value: 0 })}>Zerar Tensão</button><button className="ghost" onClick={() => setTracker('pressure', { value: 0 })}>Zerar Pressão</button></div><p className="muted">Quando Tensão enche, ela zera e aumenta Pressão. Quando Pressão enche, a situação sai do controle.</p></Card></div>
    <Card title="Elenco da caçada"><div className="sheet-actions"><select value={actorType} onChange={e => setActorType(e.target.value)}><option value="npc">NPC</option><option value="ally">Aliado</option><option value="player">Exorcista</option><option value="enemy">Inimigo / Pecado</option><option value="boss">Boss</option></select><button className="primary" onClick={addActor}>Adicionar</button></div><div className="grid two">{campaign.actors.map(a => <ActorEditor key={a.id} actor={a} update={actorUpdate} remove={deleteActor} />)}</div></Card>
    <div className="grid two"><Card title="Registro da missão"><textarea value={logText} onChange={e => setLogText(e.target.value)} placeholder="Ex.: A equipe encontrou a testemunha no hospital..." /><div className="sheet-actions"><button className="primary" onClick={() => addLog(true)}>Adicionar público</button><button className="ghost" onClick={() => addLog(false)}>Adicionar secreto</button><button className="danger" onClick={() => update({ logs: [] }, 'Registros apagados.')}>Limpar</button></div><div className="log-list">{(campaign.logs || []).map(l => <div key={l.id} className={l.public ? 'log public' : 'log private'}><small>{l.at} — {l.public ? 'Público' : 'Secreto'}</small><p>{l.text}</p></div>)}</div></Card><Card title="Como usar na mesa"><ol className="steps"><li>Revele apenas NPCs e informações marcadas como públicas.</li><li>Use +Tensão quando a mesa gastar tempo, falhar com consequência ou gerar complicações.</li><li>Em conflito, aplique estresse em aliados/exorcistas; no terceiro ferimento, qualquer novo estresse mata.</li><li>Para Pecado/inimigo, marque cortes no Talismã de Execução; ao encher, ele cai, é executado ou muda de fase conforme sua preparação.</li></ol></Card></div>
  </div>
}

function PlayerHuntPanel({ store }) {
  const { campaign, refresh, lastSync, realtimeStatus } = store
  const visibleActors = (campaign.actors || []).filter(a => a.visible)
  const visibleLogs = (campaign.logs || []).filter(l => l.public)
  return <div className="stack gap-lg"><HuntHeader campaign={campaign} /><div className="sync-strip"><span className="live-dot" /> <strong>Sincronização automática:</strong> {realtimeStatus || 'ativa'} {lastSync && <small>Última atualização: {lastSync}</small>} <button className="ghost mini-button" onClick={() => refresh(false)}>Atualizar agora</button></div><div className="grid two"><Card title="Briefing público"><p>{campaign.briefingPublic}</p><p className="muted">Esta área atualiza sozinha quando o Mestre salva alterações.</p></Card>{campaign.showTrackers && <Card title="Estado da área"><TrackerView title="Tensão" tracker={campaign.tension} /><TrackerView title="Pressão" tracker={campaign.pressure} /></Card>}</div><Card title="NPCs e alvos revelados"><div className="grid three">{visibleActors.length ? visibleActors.map(a => <ActorPublicCard key={a.id} actor={a} />) : <p className="muted">Nenhum NPC revelado ainda.</p>}</div></Card><Card title="Registro público"><div className="log-list">{visibleLogs.length ? visibleLogs.map(l => <div key={l.id} className="log public"><small>{l.at}</small><p>{l.text}</p></div>) : <p className="muted">Nenhum registro público ainda.</p>}</div></Card></div>
}

function TrackerControl({ title, tracker, onChange }) {
  return <div className="tracker-control"><div className="talisman-head"><strong>{title}</strong><label>Max<input type="number" min="1" max="12" value={tracker.max} onChange={e => onChange({ max: clamp(e.target.value, 1, 12), value: Math.min(tracker.value, clamp(e.target.value, 1, 12)) })} /></label></div><div className="slashes">{Array.from({ length: Number(tracker.max) || 1 }).map((_, i) => <button key={i} className={i < tracker.value ? 'marked' : ''} onClick={() => onChange({ value: i + 1 === tracker.value ? i : i + 1 })}>╱</button>)}</div></div>
}
function TrackerView({ title, tracker }) { return <div className="tracker-control"><strong>{title}: {tracker.value}/{tracker.max}</strong><div className="slashes read-only">{Array.from({ length: Number(tracker.max) || 1 }).map((_, i) => <span key={i} className={i < tracker.value ? 'marked' : ''}>╱</span>)}</div></div> }

function applyActorStress(actor, amount, nonlethal = false) {
  if (actor.dead) return actor
  let stress = Number(actor.stress || 0), injuries = Number(actor.injuries || 0), dead = false, status = actor.status || 'Ativo'
  const maxStress = Math.max(1, Number(actor.maxStress || 6) - injuries)
  if (nonlethal) return { ...actor, stress: Math.min(maxStress - 1, stress + amount) }
  for (let i = 0; i < amount; i++) {
    if (injuries >= 3) { dead = true; status = 'Morto'; break }
    const cap = Math.max(1, Number(actor.maxStress || 6) - injuries)
    stress += 1
    if (stress >= cap) { injuries += 1; stress = 0; if (injuries >= 3) status = 'À beira da morte' }
  }
  return { ...actor, stress, injuries, dead, status }
}
function applyExecution(actor, amount) {
  const execution = Math.min(Number(actor.executionMax || 1), Number(actor.execution || 0) + amount)
  return { ...actor, execution, dead: execution >= Number(actor.executionMax || 1), status: execution >= Number(actor.executionMax || 1) ? 'Executado / derrotado' : actor.status }
}

function ActorEditor({ actor, update, remove }) {
  const isEnemy = isHostileType(actor.type)
  const typeClass = `actor-type-${actor.type || 'npc'}`
  const typeDefaults = actorTypeDefaults(actor.type)
  const patch = p => update(actor.id, p)
  const changeType = nextType => {
    const defaults = actorTypeDefaults(nextType)
    patch({
      type: nextType,
      visible: defaults.visible,
      category: defaults.category,
      executionMax: defaults.executionMax,
      execution: isHostileType(nextType) ? Number(actor.execution || 0) : 0,
      imageFit: actor.imageFit || 'contain'
    })
  }
  const stressAction = (amount, nonlethal = false) => patch(isEnemy ? applyExecution(actor, amount) : applyActorStress(actor, amount, nonlethal))
  return <div className={`actor-editor ${typeClass} ${isEnemy ? 'hostile' : ''} ${actor.dead ? 'dead' : ''}`}>
    <div className="actor-image">{actor.image ? <img src={actor.image} alt={actor.name} style={{ objectFit: actor.imageFit || 'contain' }} /> : <span>{typeDefaults.icon}</span>}</div>
    <div className="form-grid">
      <label>Nome<CommitInput value={actor.name} onCommit={v => patch({ name: v })} /></label>
      <label>Tipo<select value={actor.type} onChange={e => changeType(e.target.value)}><option value="npc">NPC</option><option value="ally">Aliado</option><option value="player">Exorcista</option><option value="enemy">Inimigo / Pecado</option><option value="boss">Boss</option></select></label>
      <label>Função / legenda<CommitInput value={actor.subtitle} onCommit={v => patch({ subtitle: v })} /></label>
      <label>Status<CommitInput value={actor.status} onCommit={v => patch({ status: v })} /></label>
      <label className="check"><input type="checkbox" checked={!!actor.visible} onChange={e => patch({ visible: e.target.checked })} /> Visível para players</label>
      <label>Imagem URL<CommitInput value={actor.image || ''} onCommit={v => patch({ image: v })} /></label>
      <label>Enquadramento da imagem<select value={actor.imageFit || 'contain'} onChange={e => patch({ imageFit: e.target.value })}><option value="contain">Mostrar inteira</option><option value="cover">Preencher box</option></select></label>
      <label>Upload de imagem<input type="file" accept="image/*" onChange={e => readImageFile(e.target.files?.[0], data => patch({ image: data, imageFit: actor.imageFit || 'contain' }))} /></label>
    </div>
    <div className="actor-kind-row"><span className={`type-badge ${typeClass}`}>{actorTypeLabels[actor.type] || 'NPC'}</span><span className="muted">Use “Mostrar inteira” para retratos/corpo completo; use “Preencher box” para imagens horizontais.</span></div>
    <label>Info pública<CommitTextarea value={actor.publicInfo} onCommit={v => patch({ publicInfo: v })} /></label>
    <label>Notas secretas<CommitTextarea value={actor.privateInfo} onCommit={v => patch({ privateInfo: v })} /></label>
    {isEnemy ? <div className="tracker-control"><label>Talismã de Execução máximo<input type="number" min="1" max="40" value={actor.executionMax} onChange={e => patch({ executionMax: clamp(e.target.value, 1, 40), execution: Math.min(actor.execution, clamp(e.target.value, 1, 40)) })} /></label><TrackerView title="Execução" tracker={{ value: actor.execution, max: actor.executionMax }} /><div className="sheet-actions"><button onClick={() => stressAction(1)}>+1 corte</button><button onClick={() => stressAction(2)}>+2 cortes</button><button onClick={() => stressAction(3)}>+3 cortes</button><button className="ghost" onClick={() => patch({ execution: 0, dead: false, status: 'Ativo' })}>Reset execução</button></div></div> : <div className="tracker-control"><div className="stat-grid"><div><span>Estresse</span><strong>{actor.stress}/{Math.max(1, Number(actor.maxStress || 6) - Number(actor.injuries || 0))}</strong></div><div><span>Ferimentos</span><strong>{actor.injuries}/3</strong></div></div><label>Estresse máximo base<input type="number" min="1" max="20" value={actor.maxStress} onChange={e => patch({ maxStress: clamp(e.target.value, 1, 20) })} /></label><div className="sheet-actions"><button onClick={() => stressAction(1)}>+1 stress</button><button onClick={() => stressAction(2)}>+2 stress</button><button onClick={() => stressAction(3)}>+3 stress</button><button onClick={() => stressAction(1, true)}>+1 não letal</button><button className="ghost" onClick={() => patch({ stress: 0, injuries: 0, dead: false, status: 'Ativo' })}>Curar/reset</button></div></div>}
    <div className="sheet-actions"><button className="danger" onClick={() => remove(actor.id)}>Remover</button><button className="ghost" onClick={() => patch({ dead: !actor.dead, status: actor.dead ? 'Ativo' : 'Morto' })}>{actor.dead ? 'Desmarcar morto' : 'Marcar morto'}</button></div>
  </div>
}

function ActorPublicCard({ actor }) {
  const typeClass = `actor-type-${actor.type || 'npc'}`
  const typeDefaults = actorTypeDefaults(actor.type)
  return <div className={`public-actor ${typeClass} ${isHostileType(actor.type) ? 'hostile' : ''} ${actor.dead ? 'dead' : ''}`}>
    {actor.image ? <img src={actor.image} alt={actor.name} style={{ objectFit: actor.imageFit || 'contain' }} /> : <div className="public-placeholder">{typeDefaults.icon}</div>}
    <div className="actor-public-title"><h4>{actor.name}</h4><span className={`type-badge ${typeClass}`}>{actorTypeLabels[actor.type] || 'NPC'}</span></div>
    <p className="eyebrow">{actor.subtitle || actorTypeLabels[actor.type] || actor.type}</p>
    <p>{actor.publicInfo || 'Sem informações públicas ainda.'}</p>
    <span className="pill">{actor.status}</span>
  </div>
}

function HuntRulesReference() {
  return <Card title="Referência rápida da caçada" ref="p. 34–45"><div className="grid two compact-grid"><div className="mini"><strong>Fluxo</strong><List items={['Briefing → chegada → rastrear palácio/host → investigar traumas → preparar/descansar → execução → exfiltração.', 'No começo da missão, exorcistas chegam sem stress/ferimentos/hooks, com 3 bursts e kit cheio.', 'Pecado fora do palácio pode recuar e regenerar; execução definitiva acontece no palácio.']} /></div><div className="mini"><strong>Conflito e morte</strong><List items={['Conflitos começam arriscados por padrão.', 'Aliados/exorcistas acumulam stress; ao encher, ganham ferimento. Com 3 ferimentos, qualquer novo stress causa morte.', 'Pecados usam Talismã de Execução: quando enche, são derrotados/executados ou ativam fase preparada pelo Mestre.']} /></div></div></Card>
}

const HUB_LOCAL_KEY = 'cain-player-hub-v1'
const OLD_SYSTEM_MAIL_SUBJECTS = ['DOCREF // CHAMADO INICIAL']
const MISSION_MAIL_SUBJECT = 'DOCREF GYU-0107 // OPERAÇÃO VOZES NA LINHA'
const visibleInbox = rows => (rows || []).filter(m => !OLD_SYSTEM_MAIL_SUBJECTS.includes(m.subject))
const defaultMissionMail = (name = 'Exorcista') => ({
  id: crypto.randomUUID(),
  subject: MISSION_MAIL_SUBJECT,
  from_name: 'CAIN // CENTRAL',
  body: `Agente ${name},\n\nVocê foi anexado à Operação Vozes na Linha. Ponto de encontro: posto desativado da estrada velha, 21h40. Contato inicial: Marco Kirstein.\n\nDiretrizes: mantenha discrição, registre inconsistências de áudio/imagem e não responda a chamados fora do protocolo da célula. Vozes familiares, duplicações e relatos contraditórios devem ser tratados como risco ativo.\n\nAté que a Mancha seja apagada.`,
  is_read: false,
  created_at: new Date().toISOString()
})

function usePlayerHub(auth) {
  const userId = auth.user?.id || auth.user?.email || 'guest'
  const [profiles, setProfiles] = useState([])
  const [inbox, setInbox] = useState([])
  const [notes, setNotes] = useState([])
  const [contacts, setContacts] = useState([])
  const [messages, setMessages] = useState([])
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)
  const [lastSync, setLastSync] = useState('')
  const refreshingRef = useRef(false)

  function readLocal() {
    try { return JSON.parse(localStorage.getItem(HUB_LOCAL_KEY)) || {} } catch { return {} }
  }
  function writeLocal(data) { localStorage.setItem(HUB_LOCAL_KEY, JSON.stringify(data)) }
  function ensureLocal() {
    const data = readLocal()
    data.profiles ||= []
    if (userId !== 'guest' && !data.profiles.some(p => p.id === userId)) {
      data.profiles.push({ id: userId, email: auth.user?.email || '', display_name: auth.user?.name || 'Exorcista', role: auth.role || 'player', character_name: auth.user?.name || 'Exorcista', avatar_url: '', organization_title: 'CAIN' })
    }
    data.inbox ||= {}
    data.notes ||= {}
    data.contacts ||= {}
    data.messages ||= []
    if (userId !== 'guest') {
      data.inbox[userId] = visibleInbox(data.inbox[userId] || [])
      if (!data.inbox[userId].some(m => m.subject === MISSION_MAIL_SUBJECT)) data.inbox[userId] = [defaultMissionMail(auth.user?.name || auth.user?.email?.split('@')[0]), ...data.inbox[userId]]
    }
    if (userId !== 'guest' && !data.notes[userId]) data.notes[userId] = [{ id: crypto.randomUUID(), title: 'Anotações da missão', body: '', updated_at: new Date().toISOString() }]
    if (userId !== 'guest' && !data.contacts[userId]) data.contacts[userId] = []
    writeLocal(data)
    return data
  }

  async function ensureDefaultInboxOnline() {
    if (!auth.supabaseReady || !supabase || auth.role === 'guest') return
    const { data } = await supabase.from('inbox_messages').select('id').eq('user_id', userId).eq('subject', MISSION_MAIL_SUBJECT).limit(1)
    if (!data?.length) await supabase.from('inbox_messages').insert({ user_id: userId, from_name: 'CAIN // CENTRAL', subject: MISSION_MAIL_SUBJECT, body: defaultMissionMail(auth.user?.name).body })
  }

  async function refresh(silent = false) {
    if (auth.role === 'guest' || refreshingRef.current) return
    refreshingRef.current = true
    if (!silent) { setLoading(true); setStatus('') }
    try {
      if (auth.supabaseReady && supabase) {
        await ensureDefaultInboxOnline()
        const [p, i, n, c, m] = await Promise.all([
          supabase.from('profiles').select('id,email,display_name,role,avatar_url,character_name,organization_title').order('display_name', { ascending: true }),
          supabase.from('inbox_messages').select('*').order('created_at', { ascending: false }),
          supabase.from('player_notes').select('*').order('updated_at', { ascending: false }),
          supabase.from('contacts').select('id,owner_id,contact_id,created_at,contact:profiles!contacts_contact_id_fkey(id,email,display_name,role,avatar_url,character_name)').order('created_at', { ascending: false }),
          supabase.from('chat_messages').select('*').order('created_at', { ascending: true }).limit(200)
        ])
        if (p.error || i.error || n.error || c.error || m.error) setStatus([p.error, i.error, n.error, c.error, m.error].filter(Boolean).map(e => e.message).join(' | '))
        setProfiles(p.data || [])
        setInbox(visibleInbox(i.data || []))
        setNotes(n.data || [])
        setContacts(c.data || [])
        setMessages(m.data || [])
      } else {
        const data = ensureLocal()
        setProfiles(data.profiles)
        setInbox(visibleInbox(data.inbox[userId] || []))
        setNotes(data.notes[userId] || [])
        setContacts((data.contacts[userId] || []).map(id => ({ id: `${userId}-${id}`, owner_id: userId, contact_id: id, contact: data.profiles.find(p => p.id === id) })).filter(x => x.contact))
        setMessages((data.messages || []).filter(x => x.sender_id === userId || x.receiver_id === userId || auth.role === 'master'))
      }
      setLastSync(new Date().toLocaleTimeString())
    } finally {
      refreshingRef.current = false
      if (!silent) setLoading(false)
    }
  }

  useEffect(() => { refresh(false) }, [auth.user?.id, auth.role])

  useEffect(() => {
    if (auth.role === 'guest') return
    // O polling é proposital: ele garante atualização automática mesmo se o Realtime
    // caso a atualização instantânea caia temporariamente.
    const interval = setInterval(() => refresh(true), auth.supabaseReady ? 3500 : 2500)
    if (!auth.supabaseReady || !supabase) return () => clearInterval(interval)

    const onChange = () => refresh(true)
    let channel = supabase.channel(`cain-phone-live-${userId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, onChange)
      .on('postgres_changes', auth.role === 'master' ? { event: '*', schema: 'public', table: 'inbox_messages' } : { event: '*', schema: 'public', table: 'inbox_messages', filter: `user_id=eq.${userId}` }, onChange)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'player_notes', filter: `owner_id=eq.${userId}` }, onChange)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'contacts', filter: `owner_id=eq.${userId}` }, onChange)
    channel = auth.role === 'master'
      ? channel.on('postgres_changes', { event: '*', schema: 'public', table: 'chat_messages' }, onChange)
      : channel
        .on('postgres_changes', { event: '*', schema: 'public', table: 'chat_messages', filter: `sender_id=eq.${userId}` }, onChange)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'chat_messages', filter: `receiver_id=eq.${userId}` }, onChange)
    channel.subscribe()

    return () => { clearInterval(interval); supabase.removeChannel(channel) }
  }, [auth.supabaseReady, auth.role, auth.user?.id])

  async function updateMyProfile(patch) {
    if (auth.supabaseReady && supabase) {
      const { error } = await supabase.from('profiles').update(patch).eq('id', userId)
      setStatus(error ? error.message : 'Perfil atualizado.')
    } else {
      const data = ensureLocal()
      data.profiles = data.profiles.map(p => p.id === userId ? { ...p, ...patch } : p)
      writeLocal(data); setStatus('Perfil local atualizado.')
    }
    refresh(false)
  }
  async function markRead(id) {
    if (auth.supabaseReady && supabase) await supabase.from('inbox_messages').update({ is_read: true }).eq('id', id)
    else { const d = ensureLocal(); d.inbox[userId] = (d.inbox[userId] || []).map(x => x.id === id ? { ...x, is_read: true } : x); writeLocal(d) }
    refresh(true)
  }
  async function saveNote(note) {
    const next = { ...note, title: note.title || 'Nota sem título', updated_at: new Date().toISOString() }
    if (auth.supabaseReady && supabase) {
      if (next.id && !String(next.id).startsWith('new-')) await supabase.from('player_notes').update({ title: next.title, body: next.body, updated_at: next.updated_at }).eq('id', next.id)
      else await supabase.from('player_notes').insert({ owner_id: userId, title: next.title, body: next.body })
    } else {
      const d = ensureLocal(); const id = next.id && !String(next.id).startsWith('new-') ? next.id : crypto.randomUUID(); d.notes[userId] = [{ ...next, id }, ...(d.notes[userId] || []).filter(x => x.id !== next.id && x.id !== id)]; writeLocal(d)
    }
    refresh(false)
  }
  async function deleteNote(id) {
    if (auth.supabaseReady && supabase) await supabase.from('player_notes').delete().eq('id', id)
    else { const d = ensureLocal(); d.notes[userId] = (d.notes[userId] || []).filter(x => x.id !== id); writeLocal(d) }
    refresh(false)
  }
  async function addContactByEmail(email) {
    const clean = email.trim().toLowerCase()
    if (!clean) return
    if (auth.supabaseReady && supabase) {
      const { data: found } = await supabase.from('profiles').select('id,email').ilike('email', clean).maybeSingle()
      if (!found) { setStatus('Nenhum usuário encontrado com esse email.'); return }
      const { error } = await supabase.from('contacts').insert({ owner_id: userId, contact_id: found.id })
      setStatus(error ? error.message : 'Contato adicionado.')
    } else {
      const d = ensureLocal(); const found = d.profiles.find(p => p.email.toLowerCase() === clean); if (!found) { setStatus('Usuário local não encontrado.'); return } d.contacts[userId] = Array.from(new Set([...(d.contacts[userId] || []), found.id])); writeLocal(d); setStatus('Contato local adicionado.')
    }
    refresh(false)
  }
  async function sendMessage(receiverId, body) {
    const text = body.trim(); if (!text || !receiverId) return
    if (auth.supabaseReady && supabase) await supabase.from('chat_messages').insert({ sender_id: userId, receiver_id: receiverId, body: text })
    else { const d = ensureLocal(); d.messages.push({ id: crypto.randomUUID(), sender_id: userId, receiver_id: receiverId, body: text, created_at: new Date().toISOString() }); writeLocal(d) }
    refresh(true)
  }
  async function sendInbox(user_id, subject, body) {
    if (auth.role !== 'master') return setStatus('Apenas Mestre pode enviar mensagens de caixa de entrada.')
    if (!user_id || !subject.trim() || !body.trim()) return setStatus('Escolha um player e preencha assunto/corpo.')
    if (auth.supabaseReady && supabase) {
      const { error } = await supabase.from('inbox_messages').insert({ user_id, from_name: auth.user?.name || 'CAIN // MESTRE', subject, body })
      if (error) setStatus(error.message)
      else setStatus('Mensagem enviada para a caixa de entrada.')
    }
    else { const d = ensureLocal(); d.inbox[user_id] ||= []; d.inbox[user_id].unshift({ id: crypto.randomUUID(), user_id, from_name: auth.user?.name || 'CAIN // MESTRE', subject, body, is_read: false, created_at: new Date().toISOString() }); writeLocal(d); setStatus('Mensagem enviada para a caixa de entrada.') }
    refresh(false)
  }
  async function sendInboxToAll(subject, body) {
    if (auth.role !== 'master') return setStatus('Apenas Mestre pode emitir ordens de missão.')
    if (!subject.trim() || !body.trim()) return setStatus('Preencha título e texto da ordem.')
    const playerRows = profiles.filter(p => p.role === 'player')
    if (!playerRows.length) return setStatus('Nenhum player cadastrado para receber a ordem.')
    if (auth.supabaseReady && supabase) {
      const payload = playerRows.map(p => ({ user_id: p.id, from_name: 'CAIN // ORDEM DE SERVIÇO', subject, body }))
      const { error } = await supabase.from('inbox_messages').insert(payload)
      setStatus(error ? error.message : `Ordem enviada para ${playerRows.length} player(s).`)
    } else {
      const d = ensureLocal()
      playerRows.forEach(p => { d.inbox[p.id] ||= []; d.inbox[p.id].unshift({ id: crypto.randomUUID(), user_id: p.id, from_name: 'CAIN // ORDEM DE SERVIÇO', subject, body, is_read: false, created_at: new Date().toISOString() }) })
      writeLocal(d); setStatus(`Ordem local enviada para ${playerRows.length} player(s).`)
    }
    refresh(false)
  }
  async function updateInboxMessage(id, patch) {
    if (auth.role !== 'master') return setStatus('Apenas Mestre pode alterar mensagens.')
    if (!id) return
    if (auth.supabaseReady && supabase) {
      const { error } = await supabase.from('inbox_messages').update({ ...patch, updated_at: new Date().toISOString() }).eq('id', id)
      setStatus(error ? error.message : 'Mensagem atualizada.')
    } else {
      const d = ensureLocal()
      Object.keys(d.inbox || {}).forEach(uid => { d.inbox[uid] = (d.inbox[uid] || []).map(m => m.id === id ? { ...m, ...patch, updated_at: new Date().toISOString() } : m) })
      writeLocal(d); setStatus('Mensagem local atualizada.')
    }
    refresh(false)
  }
  async function deleteInboxMessage(id) {
    if (auth.role !== 'master') return setStatus('Apenas Mestre pode excluir mensagens.')
    if (!id) return
    if (auth.supabaseReady && supabase) {
      const { error } = await supabase.from('inbox_messages').delete().eq('id', id)
      setStatus(error ? error.message : 'Mensagem excluída.')
    } else {
      const d = ensureLocal()
      Object.keys(d.inbox || {}).forEach(uid => { d.inbox[uid] = (d.inbox[uid] || []).filter(m => m.id !== id) })
      writeLocal(d); setStatus('Mensagem local excluída.')
    }
    refresh(false)
  }

  return { profiles, inbox, notes, contacts, messages, status, loading, lastSync, refresh, updateMyProfile, markRead, saveNote, deleteNote, addContactByEmail, sendMessage, sendInbox, sendInboxToAll, updateInboxMessage, deleteInboxMessage }
}

function PlayerPhonePage({ auth }) {
  const hub = usePlayerHub(auth)
  const [tab, setTab] = useState(() => localStorage.getItem('cain-phone-open-tab') || 'inbox')
  useEffect(() => { const requested = localStorage.getItem('cain-phone-open-tab'); if (requested) { setTab(requested); localStorage.removeItem('cain-phone-open-tab') } }, [])
  const me = hub.profiles.find(p => p.id === (auth.user?.id || auth.user?.email)) || { display_name: auth.user?.name, email: auth.user?.email, role: auth.role }
  const tabs = ['inbox', 'notes', 'friends', 'chat', 'profile', ...(auth.role === 'master' ? ['master'] : [])]
  const labels = { inbox: 'Caixa', notes: 'Notas', friends: 'Amigos', chat: 'Chat', profile: 'Perfil', master: 'Mestre' }
  return <section className="stack gap-lg">
    <SectionTitle eyebrow="Dispositivo CAIN" title="Perfil do jogador">Uma área estilo celular para caixa de entrada, anotações, contatos e chat da operação.</SectionTitle>
    {hub.status && <div className="result-box"><strong>Status:</strong> {hub.status}</div>}
    <div className="phone-shell">
      <div className="phone-top"><div className="phone-avatar">{me.avatar_url ? <img src={me.avatar_url} alt={me.display_name} /> : '▽'}</div><div><p className="eyebrow">{me.organization_title || 'CAIN // Célula GYU'}</p><h3>{me.character_name || me.display_name || auth.user?.email}</h3><small>{auth.user?.email}</small><small className="sync-note"><span className="live-dot" /> Auto-sinc {hub.lastSync ? `// ${hub.lastSync}` : 'ativo'}</small></div><button className="ghost" onClick={() => hub.refresh(false)}>{hub.loading ? '...' : 'Atualizar agora'}</button></div>
      <div className="phone-tabs">{tabs.map(t => <button key={t} className={tab === t ? 'active' : ''} onClick={() => setTab(t)}>{labels[t]}</button>)}</div>
      <div className="phone-screen">
        {tab === 'inbox' && <InboxPanel inbox={hub.inbox} markRead={hub.markRead} />}
        {tab === 'notes' && <NotesPanel notes={hub.notes} saveNote={hub.saveNote} deleteNote={hub.deleteNote} />}
        {tab === 'friends' && <FriendsPanel contacts={hub.contacts} addContactByEmail={hub.addContactByEmail} profiles={hub.profiles} auth={auth} />}
        {tab === 'chat' && <ChatPanel auth={auth} hub={hub} />}
        {tab === 'profile' && <ProfileEditPanel me={me} save={hub.updateMyProfile} />}
        {tab === 'master' && auth.role === 'master' && <MasterMailboxPanel hub={hub} auth={auth} />}
      </div>
    </div>
  </section>
}

function InboxPanel({ inbox, markRead }) {
  const [selected, setSelected] = useState(null)
  const msg = selected || inbox[0]
  return <div className="phone-grid"><div className="message-list">{inbox.length ? inbox.map(m => <button key={m.id} className={!m.is_read ? 'unread' : ''} onClick={() => { setSelected(m); markRead(m.id) }}><strong>{m.subject}</strong><span>{m.from_name || 'CAIN'}</span><small>{new Date(m.created_at).toLocaleString()}</small></button>) : <p className="muted">Caixa vazia.</p>}</div><div className="message-view">{msg ? <><p className="eyebrow">{msg.from_name || 'CAIN'}</p><h3>{msg.subject}</h3><pre>{msg.body}</pre></> : <p className="muted">Selecione uma mensagem.</p>}</div></div>
}
function NotesPanel({ notes, saveNote, deleteNote }) {
  const [draft, setDraft] = useState({ id: 'new-note', title: '', body: '' })
  useEffect(() => { if (notes[0]) setDraft(notes[0]) }, [notes.length])
  return <div className="phone-grid"><div className="message-list"><button onClick={() => setDraft({ id: 'new-' + crypto.randomUUID(), title: '', body: '' })}>+ Nova nota</button>{notes.map(n => <button key={n.id} onClick={() => setDraft(n)}><strong>{n.title}</strong><small>{new Date(n.updated_at).toLocaleString()}</small></button>)}</div><div className="message-view"><label>Título<input value={draft.title || ''} onChange={e => setDraft({ ...draft, title: e.target.value })} /></label><label>Nota<textarea className="big-text" value={draft.body || ''} onChange={e => setDraft({ ...draft, body: e.target.value })} /></label><div className="sheet-actions"><button className="primary" onClick={() => saveNote(draft)}>Salvar nota</button>{draft.id && !String(draft.id).startsWith('new-') && <button className="danger" onClick={() => deleteNote(draft.id)}>Excluir</button>}</div></div></div>
}
function FriendsPanel({ contacts, addContactByEmail, profiles, auth }) {
  const [email, setEmail] = useState('')
  const allPlayers = profiles.filter(p => p.role === 'player')
  return <div className="grid two compact-grid"><Card title="Adicionar contato"><label>Email do exorcista<input value={email} onChange={e => setEmail(e.target.value)} placeholder="seu.codinome@cain.com" /></label><button className="primary" onClick={() => { addContactByEmail(email); setEmail('') }}>Adicionar</button><p className="muted">No começo, cada player não tem contatos adicionados. O Mestre fica disponível pelo chat.</p></Card><Card title={auth.role === 'master' ? 'Players cadastrados' : 'Contatos'}>{auth.role === 'master' ? <List items={allPlayers.map(p => `${p.display_name || p.email} — ${p.email}`)} /> : contacts.length ? contacts.map(c => <div className="friend-card" key={c.id}><strong>{c.contact?.character_name || c.contact?.display_name}</strong><small>{c.contact?.email}</small></div>) : <p className="muted">Nenhum amigo adicionado ainda.</p>}</Card></div>
}
function ChatPanel({ auth, hub }) {
  const myId = auth.user?.id || auth.user?.email
  const master = hub.profiles.find(p => p.role === 'master')
  const contactProfiles = hub.contacts.map(c => c.contact).filter(Boolean)
  const peers = auth.role === 'master' ? hub.profiles.filter(p => p.id !== myId) : [master, ...contactProfiles].filter(Boolean).filter((p, i, arr) => arr.findIndex(x => x.id === p.id) === i)
  const [peerId, setPeerId] = useState('')
  const [text, setText] = useState('')
  useEffect(() => { if (!peerId && peers[0]) setPeerId(peers[0].id) }, [peers.length])
  const selected = peers.find(p => p.id === peerId)
  const chat = hub.messages.filter(m => (m.sender_id === myId && m.receiver_id === peerId) || (m.sender_id === peerId && m.receiver_id === myId))
  return <div className="phone-grid"><div className="message-list">{peers.length ? peers.map(p => <button key={p.id} className={peerId === p.id ? 'active' : ''} onClick={() => setPeerId(p.id)}><strong>{p.character_name || p.display_name || p.email}</strong><span>{p.role}</span></button>) : <p className="muted">Nenhum contato disponível. Peça para o Mestre entrar ou adicione amigos.</p>}</div><div className="message-view chat-view"><h3>{selected ? `Chat com ${selected.character_name || selected.display_name}` : 'Chat'}</h3><div className="chat-box">{chat.map(m => <div key={m.id} className={m.sender_id === myId ? 'chat-bubble mine' : 'chat-bubble'}><p>{m.body}</p><small>{new Date(m.created_at).toLocaleString()}</small></div>)}</div><div className="chat-input"><input value={text} onChange={e => setText(e.target.value)} placeholder="Mensagem..." onKeyDown={e => { if (e.key === 'Enter') { hub.sendMessage(peerId, text); setText('') } }} /><button className="primary" onClick={() => { hub.sendMessage(peerId, text); setText('') }}>Enviar</button></div></div></div>
}
function ProfileEditPanel({ me, save }) {
  const [draft, setDraft] = useState(me)
  useEffect(() => setDraft(me), [me?.id])
  return <div className="grid two compact-grid"><Card title="Identidade"><label>Nome de exorcista<input value={draft.character_name || ''} onChange={e => setDraft({ ...draft, character_name: e.target.value })} /></label><label>Nome de perfil<input value={draft.display_name || ''} onChange={e => setDraft({ ...draft, display_name: e.target.value })} /></label><label>Organização<input value={draft.organization_title || ''} onChange={e => setDraft({ ...draft, organization_title: e.target.value })} /></label><label>Avatar por URL<input value={draft.avatar_url || ''} onChange={e => setDraft({ ...draft, avatar_url: e.target.value })} /></label><button className="primary" onClick={() => save({ display_name: draft.display_name, character_name: draft.character_name, organization_title: draft.organization_title, avatar_url: draft.avatar_url })}>Salvar perfil</button></Card><Card title="Como isso aparece"><div className="public-actor">{draft.avatar_url ? <img src={draft.avatar_url} alt="avatar" /> : <div className="public-placeholder">▽</div>}<h4>{draft.character_name || draft.display_name || 'Exorcista'}</h4><p className="eyebrow">{draft.organization_title || 'CAIN'}</p><p>{me.email}</p><span className="pill">{me.role}</span></div></Card></div>
}
function MasterMailboxPanel({ hub }) {
  const [tab, setTab] = useState('orders')
  const tabs = { orders: 'Ordens / Missões', individual: 'Mensagem individual', monitor: 'Monitor de chats' }
  return <div className="master-phone-panel">
    <div className="phone-tabs inner-tabs">{Object.entries(tabs).map(([id, label]) => <button key={id} className={tab === id ? 'active' : ''} onClick={() => setTab(id)}>{label}</button>)}</div>
    {tab === 'orders' && <MissionOrdersPanel hub={hub} />}
    {tab === 'individual' && <IndividualMailPanel hub={hub} />}
    {tab === 'monitor' && <ChatMonitorPanel hub={hub} />}
  </div>
}
function IndividualMailPanel({ hub }) {
  const players = hub.profiles.filter(p => p.role === 'player')
  const [playerId, setPlayerId] = useState('')
  const [subject, setSubject] = useState('DOCREF // BRIEFING PESSOAL')
  const [body, setBody] = useState('')
  useEffect(() => { if (!playerId && players[0]) setPlayerId(players[0].id) }, [players.length])
  return <div className="grid two compact-grid"><Card title="Enviar mensagem individual"><label>Destinatário<select value={playerId} onChange={e => setPlayerId(e.target.value)}>{players.map(p => <option value={p.id} key={p.id}>{p.character_name || p.display_name || p.email} — {p.email}</option>)}</select></label><label>Assunto<input value={subject} onChange={e => setSubject(e.target.value)} /></label><label>Mensagem<textarea className="big-text" value={body} onChange={e => setBody(e.target.value)} placeholder="Mensagem secreta/pessoal para este player." /></label><button className="primary" onClick={() => { hub.sendInbox(playerId, subject, body); setBody('') }}>Enviar para caixa de entrada</button></Card><Card title="Players cadastrados"><div className="log-list">{players.map(p => <div className="friend-card" key={p.id}><strong>{p.character_name || p.display_name || p.email}</strong><small>{p.email}</small></div>)}</div></Card></div>
}
function MissionOrdersPanel({ hub }) {
  const players = hub.profiles.filter(p => p.role === 'player')
  const [subject, setSubject] = useState('ORDEM DE SERVIÇO // NOVA DIRETRIZ')
  const [body, setBody] = useState('')
  const [selectedId, setSelectedId] = useState('')
  const visibleMessages = (hub.inbox || []).filter(m => !OLD_SYSTEM_MAIL_SUBJECTS.includes(m.subject)).sort((a,b)=>String(b.created_at || '').localeCompare(String(a.created_at || '')))
  const selected = visibleMessages.find(m => m.id === selectedId) || visibleMessages[0]
  const [editSubject, setEditSubject] = useState('')
  const [editBody, setEditBody] = useState('')
  useEffect(() => { if (selected) { setSelectedId(selected.id); setEditSubject(selected.subject || ''); setEditBody(selected.body || '') } }, [selected?.id])
  const recipientName = id => {
    const p = players.find(x => x.id === id) || hub.profiles.find(x => x.id === id)
    return p?.character_name || p?.display_name || p?.email || id
  }
  return <div className="grid two compact-grid">
    <Card title="Emitir Ordem de Serviço / Missão">
      <p className="muted">Envia a mesma ordem para a caixa de entrada de todos os players cadastrados. Eles recebem um aviso na tela para abrir o Celular CAIN.</p>
      <label>Título da ordem<input value={subject} onChange={e => setSubject(e.target.value)} /></label>
      <label>Texto da ordem<textarea className="big-text" value={body} onChange={e => setBody(e.target.value)} placeholder="Escreva a ordem, ponto de encontro, diretrizes e restrições liberadas aos agentes." /></label>
      <div className="sheet-actions"><button className="primary" onClick={() => { hub.sendInboxToAll(subject, body); setBody('') }}>Enviar para todos os players</button><span className="pill">{players.length} destinatário(s)</span></div>
    </Card>
    <Card title="Mensagens emitidas">
      <div className="phone-grid compact-phone-grid">
        <div className="message-list order-list">{visibleMessages.length ? visibleMessages.map(m => <button key={m.id} className={selected?.id === m.id ? 'active' : ''} onClick={() => setSelectedId(m.id)}><strong>{m.subject}</strong><span>Para: {recipientName(m.user_id)}</span><small>{m.created_at ? new Date(m.created_at).toLocaleString() : 'sem data'}</small></button>) : <p className="muted">Nenhuma mensagem emitida ainda.</p>}</div>
        <div className="message-view order-edit">{selected ? <><p className="eyebrow">Editar / excluir</p><label>Assunto<input value={editSubject} onChange={e => setEditSubject(e.target.value)} /></label><label>Mensagem<textarea className="big-text" value={editBody} onChange={e => setEditBody(e.target.value)} /></label><div className="sheet-actions"><button className="primary" onClick={() => hub.updateInboxMessage(selected.id, { subject: editSubject, body: editBody })}>Salvar alteração</button><button className="danger" onClick={() => { if (confirm('Excluir esta mensagem da caixa do destinatário?')) hub.deleteInboxMessage(selected.id) }}>Excluir mensagem</button></div></> : <p className="muted">Selecione uma mensagem.</p>}</div>
      </div>
    </Card>
  </div>
}
function ChatMonitorPanel({ hub }) {
  return <Card title="Monitor de chats"><div className="log-list">{hub.messages.slice(-60).reverse().map(m => { const sender = hub.profiles.find(p => p.id === m.sender_id); const receiver = hub.profiles.find(p => p.id === m.receiver_id); return <div className="log" key={m.id}><small>{new Date(m.created_at).toLocaleString()}</small><p><strong>{sender?.display_name || m.sender_id}</strong> → <strong>{receiver?.display_name || m.receiver_id}</strong>: {m.body}</p></div> })}</div></Card>
}


function Home({ setActive, auth }) {
  const agentName = auth.user?.name || auth.user?.email?.split('@')[0] || 'agente'
  return <section className="stack gap-xl">
    {auth.role !== 'guest' && <div className="welcome-banner"><div><p className="eyebrow">Canal seguro estabelecido</p><h2>Bem-vindo, {agentName}.</h2><p>CAIN reconhece sua presença na célula. Mantenha discrição, registre inconsistências e não confie em sinais não verificados. A missão começa quando a ordem chegar ao seu dispositivo.</p></div><button className="primary" onClick={() => openPhoneTab(setActive, 'inbox')}>Abrir caixa de entrada</button></div>}
    <div className="hero-panel">
      <div><p className="eyebrow">Resumo jogável + ferramentas</p><h2>Caçadas, trauma, pressão e execução — tudo pronto para mesa.</h2><p>Esta versão atualizada inclui regras essenciais, criação, agendas, blasfêmias, kit, armas, marcas, caçada, Admin, Pecados, oponentes, rolador, talismãs e ficha digital salva no navegador.</p><div className="hero-actions"><button className="primary" onClick={() => setActive('sheet')}>Criar/abrir ficha</button><button className="ghost" onClick={() => setActive('tools')}>Ferramentas de mesa</button></div></div>
      <DiceRoller compact />
    </div>
    <div className="grid three">{sourceMap.map(x => <Card key={x.section} title={x.section} ref={x.pages}><p>Use esta seção do livro para aprofundar quando a mesa quiser mais detalhe.</p></Card>)}</div>
  </section>
}

function RulesPage() {
  return <section className="stack gap-lg"><SectionTitle eyebrow="Motor" title="Regras centrais">O essencial para resolver ações sem parar a sessão.</SectionTitle><div className="grid two">{quickRules.map(r => <Card key={r.title} title={r.title} ref={r.ref}><p>{r.body}</p></Card>)}</div><Card title="Escala por Categoria" ref="p. 18–19"><div className="table-wrap"><table><thead><tr><th>CAT</th><th>Escala</th><th>Pessoas</th><th>Tamanho</th><th>Área</th><th>Alcance</th><th>Velocidade</th></tr></thead><tbody>{categoryRows.map(r => <tr key={r.cat}><td>{r.cat}</td><td>{r.label}</td><td>{r.people}</td><td>{r.size}</td><td>{r.area}</td><td>{r.range}</td><td>{r.speed}</td></tr>)}</tbody></table></div></Card></section>
}

function CreationPage() {
  return <section className="stack gap-lg"><SectionTitle eyebrow="Exorcista" title="Criação e evolução">Faça personagem em poucos minutos e consulte as regras de corpo/avanço.</SectionTitle><div className="grid two">{creationSteps.map(s => <Card key={s.title} title={s.title} ref={s.ref}><p>{s.body}</p></Card>)}</div><Card title="Perícias" ref="p. 22–25"><div className="grid two compact-grid">{skills.map(s => <div className="mini" key={s.key}><strong>{s.pt}</strong><small>{s.original}</small><p>{s.hint}</p></div>)}</div></Card><div className="grid two">{exorcistRules.map(r => <Card key={r.title} title={r.title} ref={r.ref}><List items={r.items} /></Card>)}</div></section>
}

function AgendasPage({ query }) {
  const q = query.trim().toLowerCase()
  const filtered = agendas.filter(a => !q || `${a.name} ${a.pt} ${a.summary} ${a.items.join(' ')} ${a.abilities.join(' ')}`.toLowerCase().includes(q))
  return <section className="stack gap-lg"><SectionTitle eyebrow="Motivação" title="Agendas completas em resumo">Cada agenda dá XP por comportamento e abre habilidades de avanço.</SectionTitle><div className="grid two">{filtered.map(a => <Card key={a.name} title={`${a.pt} / ${a.name}`} ref={a.ref}><p>{a.summary}</p><div className="pill-row">{a.items.map((i, idx) => <span className="pill" key={idx}>{i}</span>)}</div><h4>Habilidades</h4><List items={a.abilities} /></Card>)}</div></section>
}

function BlasphemiesPage({ query }) {
  const q = query.trim().toLowerCase()
  const filtered = blasphemies.filter(b => !q || `${b.name} ${b.pt} ${b.concept} ${b.passive} ${b.powers.flat().join(' ')}`.toLowerCase().includes(q))
  return <section className="stack gap-lg"><SectionTitle eyebrow="Poderes" title="Blasfêmias e poderes">Use este resumo na mesa; para texto exato e casos estranhos, abra a página indicada.</SectionTitle><Card title="Tags e avanço" ref="p. 52–53"><p>Todos começam com Blast. Poderes podem exigir burst, rolagem de PSYCHE, tags de duração, alcance e tipo. Você pode comprar poderes novos com avanço; blasfêmias extras reduzem capacidade de pecado e aumentam o custo de XP.</p><div className="pill-row">{powerTags.flatMap(g => g.tags.map(t => <span className="pill" key={g.group+t}>{g.group}: {t}</span>))}</div></Card><div className="grid two">{filtered.map(b => <Card key={b.name} title={`${b.pt} / ${b.name}`} ref={b.ref}><p>{b.concept}</p><p><strong>Passiva:</strong> {b.passive}</p>{b.special && <p className="warning"><strong>Especial:</strong> {b.special}</p>}<div className="power-list">{b.powers.map(([name, text]) => <div className="power" key={name}><strong>{name}</strong><p>{text}</p></div>)}</div></Card>)}</div></section>
}

function KitPage() {
  return <section className="stack gap-lg"><SectionTitle eyebrow="Recursos" title="Kit, scrip, armas e marcas">Resumo para compras, equipamento, upgrades e mutações.</SectionTitle><div className="grid three">{kitRules.map(r => <Card key={r.title} title={r.title} ref={r.ref}><List items={r.items} /></Card>)}</div><Card title="Catálogo de kit por categoria" ref="p. 79–83"><div className="grid two compact-grid">{kitCatalog.map(g => <div className="mini" key={g.group}><strong>{g.group}</strong><small>Livro {g.ref}</small><List items={g.items} /></div>)}</div></Card><Card title="Marcas de Pecado" ref="p. 86–87"><p>Cada marca reduz capacidade de overflow em 2 e soma +1 nas futuras rolagens de resistência. Resultado repetido evolui a marca.</p><div className="grid two">{sinMarks.map(m => <div className="mini" key={m.name}><strong>{m.name}</strong><small>{m.appearance}</small><List items={m.options} /></div>)}</div></Card></section>
}

function HuntPage() {
  return <section className="stack gap-lg"><SectionTitle eyebrow="Missão" title="Estrutura da caçada">O fluxo de jogo completo, da reunião inicial até a exfiltração.</SectionTitle><div className="timeline">{huntFlow.map(h => <Card key={h.step} title={h.step} ref={h.ref}><p>{h.text}</p></Card>)}</div><div className="grid two">{conflictRules.map(c => <Card key={c.title} title={c.title} ref={c.ref}><p>{c.body}</p></Card>)}</div></section>
}

function AdminPage() {
  return <section className="stack gap-lg"><SectionTitle eyebrow="Admin" title="Como conduzir CAIN">Pressione sem travar a investigação; deixe a tragédia humana aparecer.</SectionTitle><div className="grid two">{adminPrinciples.map(p => <Card key={p.title} title={p.title} ref={p.ref}><p>{p.body}</p></Card>)}</div><Card title="Movimentos de Tensão" ref="p. 105–106"><div className="pill-row">{tensionMoves.map(m => <span className="pill" key={m}>{m}</span>)}</div></Card><Card title="Checklist de investigação" ref="p. 94–95, 109"><ol className="steps">{investigationSteps.map((s, i) => <li key={i}>{s}</li>)}</ol></Card></section>
}

function SinsPage({ query }) {
  const q = query.trim().toLowerCase()
  const filtered = sinTypes.filter(s => !q || `${s.name} ${s.pt} ${s.emotion} ${s.summary} ${s.play.join(' ')}`.toLowerCase().includes(q))
  return <section className="stack gap-lg"><SectionTitle eyebrow="Ameaças" title="Pecados: estrutura e tipos">Pecados são tragédias psíquicas com palácio, domínios, trauma, pressão e execução.</SectionTitle><div className="grid two">{sinCore.map(s => <Card key={s.title} title={s.title} ref={s.ref}><p>{s.body}</p></Card>)}</div><SectionTitle eyebrow="Tipos" title="Os seis tipos principais" /><div className="grid two">{filtered.map(s => <Card key={s.name} title={`${s.pt} / ${s.name}`} ref={s.ref}><p><strong>Emoção:</strong> {s.emotion}</p><p>{s.summary}</p><List items={s.play} /></Card>)}</div></section>
}

function OpponentsPage() {
  return <section className="stack gap-lg"><SectionTitle eyebrow="Extras" title="Oponentes, Traces e Binders">Referência rápida para ameaças além do Pecado principal.</SectionTitle><div className="grid two">{opponentRules.map(o => <Card key={o.title} title={o.title} ref={o.ref}><p>{o.body}</p></Card>)}</div><Card title="Temas rápidos de Binder" ref="p. 152–153"><div className="pill-row">{binderThemes.map(t => <span className="pill" key={t}>{t}</span>)}</div></Card></section>
}

function ToolsPage() {
  return <section className="stack gap-lg"><SectionTitle eyebrow="Mesa" title="Ferramentas digitais">Rolador, talismãs, criador de caçada e criador de Pecado.</SectionTitle><div className="grid two"><DiceRoller /><TalismanTracker /></div><div className="grid two"><HuntBuilder /><SinBuilder /></div></section>
}

function DiceRoller({ compact = false }) {
  const [skill, setSkill] = useState(1), [adv, setAdv] = useState(0), [hard, setHard] = useState(false), [risky, setRisky] = useState(true), [result, setResult] = useState(null)
  const pool = Math.min(6, Math.max(0, Number(skill) + Number(adv)))
  function roll() {
    const dice = pool === 0 ? [rollD6(), rollD6()] : Array.from({ length: pool }, rollD6)
    const used = pool === 0 ? [Math.min(...dice)] : dice
    const successes = used.filter(d => hard ? d === 6 : d >= 4).length
    const risk = risky ? rollD6() : null
    setResult({ dice, used, successes, risk })
  }
  const riskText = result?.risk ? ({1:'Muito pior',2:'Pior',3:'Pior',4:'Esperado',5:'Esperado',6:'Melhor'}[result.risk]) : 'Sem risco'
  return <Card title="Rolador" ref="p. 11–13" className={compact ? 'compact-card' : ''}>
    <div className="form-grid"><label>Perícia<input type="number" min="0" max="4" value={skill} onChange={e => setSkill(e.target.value)} /></label><label>Vantagem<input type="number" min="0" max="3" value={adv} onChange={e => setAdv(e.target.value)} /></label><label className="check"><input type="checkbox" checked={hard} onChange={e => setHard(e.target.checked)} /> Difícil</label><label className="check"><input type="checkbox" checked={risky} onChange={e => setRisky(e.target.checked)} /> Arriscada</label></div>
    <button className="primary" onClick={roll}>Rolar {pool === 0 ? '0D' : `${pool}D`}</button>
    {result && <div className="result-box"><p><strong>Dados:</strong> {result.dice.join(', ')} {pool === 0 && `(usa ${result.used[0]})`}</p><p><strong>Sucessos:</strong> {result.successes}</p><p><strong>Risco:</strong> {result.risk ?? '-'} {riskText}</p></div>}
  </Card>
}

function TalismanTracker() {
  const KEY = 'cain-v13-talismans'
  const [list, setList] = useState(() => { try { return JSON.parse(localStorage.getItem(KEY)) || [{ id: crypto.randomUUID(), name: 'Tensão', max: 3, value: 0, note: '' }, { id: crypto.randomUUID(), name: 'Pressão', max: 6, value: 0, note: '' }] } catch { return [] } })
  useEffect(() => localStorage.setItem(KEY, JSON.stringify(list)), [list])
  const update = (id, patch) => setList(xs => xs.map(x => x.id === id ? { ...x, ...patch } : x))
  return <Card title="Talismãs" ref="p. 17, 39, 93"><button className="ghost" onClick={() => setList([...list, { id: crypto.randomUUID(), name: 'Novo talismã', max: 4, value: 0, note: '' }])}>Adicionar</button>{list.map(t => <div className="talisman" key={t.id}><div className="talisman-head"><input value={t.name} onChange={e => update(t.id, { name: e.target.value })} /><label>Max<input type="number" value={t.max} min="1" max="20" onChange={e => update(t.id, { max: clamp(e.target.value, 1, 20), value: Math.min(t.value, clamp(e.target.value,1,20)) })} /></label></div><div className="slashes">{Array.from({ length: Number(t.max) || 1 }).map((_, i) => <button key={i} className={i < t.value ? 'marked' : ''} onClick={() => update(t.id, { value: i + 1 === t.value ? i : i + 1 })}>╱</button>)}</div><textarea value={t.note} onChange={e => update(t.id, { note: e.target.value })} placeholder="Notas / consequência" /><button className="danger" onClick={() => setList(list.filter(x => x.id !== t.id))}>Remover</button></div>)}</Card>
}

function HuntBuilder() {
  const [text, setText] = useState('')
  const template = `BRIEFING\n- Tipo de Pecado:\n- Incidente inicial:\n- Pontos de interesse iniciais (2–3):\n\nHOST\n- Nome/estado/local:\n\nTRAUMAS\n1. Pergunta/resposta/pista:\n2. Pergunta/resposta/pista:\n3. Pergunta/resposta/pista:\n\nPALÁCIO\n- Entrada:\n- Aparência:\n- Regra estranha:\n\nTENSÃO/PRESSÃO\n- Movimento de tensão favorito:\n- Efeito de pressão 1–5:\n- Saiu de controle:\n\nCENAS PROVÁVEIS\n- Investigação:\n- Preparação:\n- Conflito:\n- Execução:`
  return <Card title="Criador de Caçada" ref="p. 94–95, 109"><button className="ghost" onClick={() => setText(template)}>Gerar modelo</button><textarea className="big-text" value={text} onChange={e => setText(e.target.value)} placeholder="Clique em gerar modelo..." /></Card>
}

function SinBuilder() {
  const [type, setType] = useState(sinTypes[0].name), [cat, setCat] = useState(2), [pressure, setPressure] = useState(0)
  const sin = sinTypes.find(s => s.name === type)
  const exec = 8 + Number(cat) + Number(pressure)
  return <Card title="Criador de Pecado" ref="p. 101–109"><div className="form-grid"><label>Tipo<select value={type} onChange={e => setType(e.target.value)}>{sinTypes.map(s => <option key={s.name}>{s.name}</option>)}</select></label><label>CAT<input type="number" min="0" max="7" value={cat} onChange={e => setCat(clamp(e.target.value, 0, 7))} /></label><label>Pressão<input type="number" min="0" max="6" value={pressure} onChange={e => setPressure(clamp(e.target.value, 0, 6))} /></label></div><div className="result-box"><p><strong>{sin.pt}</strong> — emoção: {sin.emotion}</p><p>{sin.summary}</p><p><strong>Talismã de execução:</strong> {exec} cortes</p><p><strong>Palácio:</strong> defina uma entrada física/psíquica na área da investigação.</p></div></Card>
}


const defaultSkills = Object.fromEntries(skills.map(s => [s.key, 1]))
const SHEET_KEY = 'cain-v13-character-sheet'
const SHEET_LIST_KEY = 'cain-v13-character-library'
const creationQuestions = [
  ['manifestation', 'Como seus poderes apareceram pela primeira vez?'],
  ['sinSeed', 'Seu sin-seed está no cérebro ou no coração?'],
  ['hiddenTruth', 'O que você esconde no lugar mais profundo de si?'],
  ['hand', 'Sua mão é sua mão?'],
  ['mother', 'Você lembra o rosto da sua mãe?']
]
const skillKeys = skills.map(s => s.key)
const randomId = () => `EX-${Math.floor(100000 + Math.random() * 900000)}-${String.fromCharCode(65 + Math.floor(Math.random()*26))}${String.fromCharCode(65 + Math.floor(Math.random()*26))}`
const lineLabel = pair => Array.isArray(pair) ? `${pair[0]} — ${pair[1]}` : String(pair)
const appendLine = (current, value) => {
  const text = lineLabel(value).trim()
  if (!text) return current || ''
  const lines = String(current || '').split('\n').map(x => x.trim()).filter(Boolean)
  if (lines.some(x => x.toLowerCase() === text.toLowerCase())) return lines.join('\n')
  return [...lines, text].join('\n')
}
const missionCategory = missions => missions >= 7 ? 5 : missions >= 4 ? 4 : missions >= 2 ? 3 : missions >= 1 ? 2 : 1
const nextCategoryText = missions => missions < 1 ? 'CAT 2 após 1 missão sobrevivida' : missions < 2 ? 'CAT 3 após 2 missões totais' : missions < 4 ? 'CAT 4 após 4 missões totais' : missions < 7 ? 'CAT 5 após 7 missões totais' : 'Limite padrão de progressão atingido: CAT 5'

function CharacterSheet() {
  const [sheet, setSheet] = useState(() => { try { return { ...defaultSheet(), ...(JSON.parse(localStorage.getItem(SHEET_KEY)) || {}) } } catch { return defaultSheet() } })
  const [library, setLibrary] = useState(() => { try { return JSON.parse(localStorage.getItem(SHEET_LIST_KEY)) || [] } catch { return [] } })
  const [selectedSlot, setSelectedSlot] = useState('')
  const [boosts, setBoosts] = useState(['force', 'conditioning'])
  const [zeros, setZeros] = useState(['covert', 'interfacing', 'negotiation'])
  const [log, setLog] = useState('')
  const fileRef = useRef(null)

  useEffect(() => localStorage.setItem(SHEET_KEY, JSON.stringify(sheet)), [sheet])
  useEffect(() => localStorage.setItem(SHEET_LIST_KEY, JSON.stringify(library)), [library])

  const update = patch => setSheet(s => ({ ...s, ...patch }))
  const updateSkill = (key, value) => setSheet(s => ({ ...s, skills: { ...defaultSkills, ...(s.skills || {}), [key]: clamp(value, 0, 3) } }))
  const updateQuestion = (key, value) => setSheet(s => ({ ...s, creation: { ...(s.creation || {}), [key]: value } }))
  const psyche = Math.ceil((Number(sheet.category) || 1) / 2)
  const maxStress = Math.max(1, 6 + Number(sheet.maxStressBonus || 0) - Number(sheet.injuries || 0))
  const sinCap = Math.max(1, 10 + Number(sheet.sinCapBonus || 0) - Number(sheet.extraBlasphemies || 0) - Number(sheet.sinMarks || 0) * 2 - Number(sheet.lostSinBoxes || 0))
  const skillValues = { ...defaultSkills, ...(sheet.skills || {}) }
  const remainingKit = Math.max(0, Number(sheet.maxKit || 0) - Number(sheet.kitSpent || 0))
  const recommendedCat = missionCategory(Number(sheet.missions || 0))
  const selectedAgenda = agendas.find(a => a.name === sheet.agenda) || agendas[0]
  const selectedBlasphemy = blasphemies.find(b => b.name === sheet.blasphemy) || blasphemies[0]
  const initialValid = Object.values(skillValues).filter(v => Number(v) === 2).length === 2 && Object.values(skillValues).filter(v => Number(v) === 0).length === 3 && Object.values(skillValues).filter(v => Number(v) === 1).length === skills.length - 5
  const creationProgress = [sheet.name, sheet.id, sheet.look, sheet.agenda, sheet.agendaAbilities, sheet.blasphemy, sheet.blasphemyPowers, initialValid].filter(Boolean).length

  function exportJson() {
    const blob = new Blob([JSON.stringify(sheet, null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `${sheet.name || 'exorcista'}-cain.json`
    a.click()
    URL.revokeObjectURL(a.href)
  }
  function importJson(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => { try { setSheet({ ...defaultSheet(), ...JSON.parse(reader.result) }); setLog('Ficha importada com sucesso.') } catch { alert('JSON inválido') } }
    reader.readAsText(file)
  }
  function saveToLibrary() {
    const id = sheet.localId || crypto.randomUUID()
    const stored = { ...sheet, localId: id, savedAt: new Date().toISOString() }
    setSheet(stored)
    setLibrary(list => [stored, ...list.filter(x => x.localId !== id)].slice(0, 25))
    setSelectedSlot(id)
    setLog('Ficha salva na biblioteca local deste navegador.')
  }
  function loadFromLibrary(id) {
    const found = library.find(x => x.localId === id)
    if (found) { setSheet({ ...defaultSheet(), ...found }); setSelectedSlot(id); setLog('Ficha carregada da biblioteca local.') }
  }
  function deleteFromLibrary(id) {
    setLibrary(list => list.filter(x => x.localId !== id))
    if (selectedSlot === id) setSelectedSlot('')
  }
  function applyInitialSkills() {
    const chosenBoosts = [...new Set(boosts)].filter(Boolean)
    const chosenZeros = [...new Set(zeros)].filter(Boolean)
    if (chosenBoosts.length !== 2 || chosenZeros.length !== 3 || chosenBoosts.some(x => chosenZeros.includes(x))) {
      setLog('Escolha 2 perícias para 2 e 3 perícias diferentes para 0, sem repetir.')
      return
    }
    const next = Object.fromEntries(skillKeys.map(k => [k, 1]))
    chosenBoosts.forEach(k => { next[k] = 2 })
    chosenZeros.forEach(k => { next[k] = 0 })
    update({ skills: next })
    setLog('Distribuição inicial aplicada: todas 1, duas em 2, três em 0.')
  }
  function addStress(amount, nonlethal = false) {
    setSheet(s => {
      let stress = Number(s.stress || 0)
      let injuries = Number(s.injuries || 0)
      const bonus = Number(s.maxStressBonus || 0)
      if (nonlethal) {
        const cap = Math.max(1, 6 + bonus - injuries)
        return { ...s, stress: Math.min(Math.max(0, cap - 1), stress + amount) }
      }
      for (let i = 0; i < amount; i++) {
        if (injuries >= 3) { stress += 1; continue }
        const cap = Math.max(1, 6 + bonus - injuries)
        stress += 1
        if (stress >= cap) { injuries += 1; stress = 0 }
      }
      return { ...s, stress, injuries }
    })
  }
  function spendBurstOrSin() {
    if (Number(sheet.psycheBursts || 0) > 0) update({ psycheBursts: Number(sheet.psycheBursts) - 1 })
    else gainSinD3()
  }
  function gainSinD3() {
    const gain = rollD3()
    update({ sin: Number(sheet.sin || 0) + gain })
    setLog(`Você ganhou ${gain} de Pecado.`)
  }
  function resolveOverflow() {
    const die = rollD6()
    const total = die + Number(sheet.sinMarks || 0)
    if (Number(sheet.lostSinBoxes || 0) >= 10) { setLog('Sem caixas de Pecado restantes: falha automática no overflow.'); return }
    if (Number(sheet.sinMarks || 0) === 0 || die === 1 || total <= 6) {
      update({ sin: 0, lostSinBoxes: Number(sheet.lostSinBoxes || 0) + 2, sinMarks: Number(sheet.sinMarks || 0) + 1 })
      setLog(`Resistência passou (${die}+marcas=${total}). Pecado zerado, +1 marca, +2 caixas perdidas.`)
    } else setLog(`Resistência falhou (${die}+marcas=${total}). O exorcista deve desistir/virar antagonista ou resolver com o Admin.`)
  }
  function addXpFromChecklist() {
    const gained = ['xpSurvived','xpAgenda','xpBold','xpInjury'].reduce((n, k) => n + (sheet[k] ? 1 : 0), 0)
    const total = Number(sheet.xp || 0) + gained
    const newAdvances = Number(sheet.advances || 0) + Math.floor(total / 4)
    update({ xp: total % 4, advances: newAdvances, xpSurvived: false, xpAgenda: false, xpBold: false, xpInjury: false })
    setLog(`XP adicionado: +${gained}. Avanços gerados se bateu 4 XP.`)
  }
  function addAgendaAbility(ability) { update({ agendaAbilities: appendLine(sheet.agendaAbilities, ability) }) }
  function addBlasphemyPower(power) { update({ blasphemyPowers: appendLine(sheet.blasphemyPowers, power) }) }

  return <section className="stack gap-lg">
    <SectionTitle eyebrow="Ficha digital ampliada" title="Exorcista">Agora a ficha funciona como criador guiado, gestor de recursos e biblioteca local de personagens. Baseado na criação da p. 44–45, com agendas p. 46–51 e blasfêmias p. 52–77.</SectionTitle>
    <div className="sheet-actions"><button className="primary" onClick={exportJson}>Exportar JSON</button><button className="ghost" onClick={() => fileRef.current?.click()}>Importar JSON</button><button className="ghost" onClick={() => window.print()}>Imprimir / PDF</button><button className="ghost" onClick={() => update({ id: randomId() })}>Gerar ID</button><button className="ghost" onClick={() => update({ stress: 0, injuries: 0, hooks: '', psycheBursts: 3, kitSpent: 0, pathos: 0 })}>Reset de missão</button><button className="danger" onClick={() => confirm('Apagar ficha?') && setSheet(defaultSheet())}>Apagar ficha</button><input hidden ref={fileRef} type="file" accept="application/json" onChange={importJson} /></div>
    {log && <div className="result-box"><strong>Registro:</strong> {log}</div>}

    <Card title="Biblioteca local de fichas"><div className="form-grid"><label>Fichas salvas neste navegador<select value={selectedSlot} onChange={e => loadFromLibrary(e.target.value)}><option value="">Selecione...</option>{library.map(x => <option key={x.localId} value={x.localId}>{x.name || 'Sem nome'} — {x.id || 'sem ID'}</option>)}</select></label><div className="button-column"><button className="primary" onClick={saveToLibrary}>Salvar ficha atual na biblioteca</button>{selectedSlot && <button className="danger" onClick={() => deleteFromLibrary(selectedSlot)}>Excluir slot selecionado</button>}</div></div><p className="muted">A biblioteca é local. Para mandar para amigos, use Exportar JSON.</p></Card>

    <div className="grid two">
      <Card title="Criador guiado" ref="p. 44"><div className="progress"><span style={{ width: `${Math.round((creationProgress / 8) * 100)}%` }} /></div><p><strong>{creationProgress}/8 passos essenciais preenchidos.</strong> Para uma ficha inicial válida: identidade, aparência, perguntas, distribuição de perícias, 1 agenda + 1 habilidade, 1 blasfêmia + 2 poderes.</p><ol className="steps"><li>Responda as perguntas íntimas e defina visual.</li><li>Use o distribuidor de perícias: todas 1, duas em 2, três em 0.</li><li>Escolha Agenda e adicione 1 habilidade inicial.</li><li>Escolha Blasfêmia e adicione 2 poderes iniciais. Todos têm Blast.</li><li>Comece CAT 1, PSYCHE 1, 3 Bursts, 5 KP, 0 Pecado e 0 ferimentos.</li></ol><p className={initialValid ? 'ok-text' : 'warning'}>{initialValid ? 'Distribuição inicial de perícias parece válida.' : 'Perícias ainda não seguem a distribuição inicial padrão.'}</p></Card>
      <Card title="Perguntas do exorcista" ref="p. 44"><div className="form-grid single">{creationQuestions.map(([key, label]) => <label key={key}>{label}<textarea value={sheet.creation?.[key] || ''} onChange={e => updateQuestion(key, e.target.value)} /></label>)}</div></Card>
    </div>

    <div className="grid two"><Card title="Identidade"><div className="form-grid"><label>Nome<input value={sheet.name} onChange={e => update({ name: e.target.value })} /></label><label>ID<input value={sheet.id} onChange={e => update({ id: e.target.value })} /></label><label>Jogador<input value={sheet.player} onChange={e => update({ player: e.target.value })} /></label><label>Pronomes<input value={sheet.pronouns} onChange={e => update({ pronouns: e.target.value })} /></label></div><label>Visual / presença<textarea value={sheet.look} onChange={e => update({ look: e.target.value })} placeholder="Roupa, postura, cicatrizes, marcas, olhar, voz..." /></label></Card>
    <Card title="Estado"><div className="stat-grid"><div><span>CAT</span><input type="number" min="1" max="7" value={sheet.category} onChange={e => update({ category: clamp(e.target.value, 1, 7) })} /></div><div><span>PSYCHE</span><strong>{psyche}</strong></div><div><span>Stress Máx.</span><strong>{maxStress}</strong></div><div><span>Cap. Pecado</span><strong>{sinCap}</strong></div><div><span>KP restante</span><strong>{remainingKit}</strong></div><div><span>CAT por missões</span><strong>{recommendedCat}</strong></div></div><div className="form-grid"><label>Estresse<input type="number" min="0" max="30" value={sheet.stress} onChange={e => update({ stress: clamp(e.target.value, 0, 30) })} /></label><label>Ferimentos<input type="number" min="0" max="3" value={sheet.injuries} onChange={e => update({ injuries: clamp(e.target.value, 0, 3) })} /></label><label>Pathos<input type="number" min="0" max="3" value={sheet.pathos} onChange={e => update({ pathos: clamp(e.target.value, 0, 3) })} /></label><label>Bursts<input type="number" min="0" max="12" value={sheet.psycheBursts} onChange={e => update({ psycheBursts: clamp(e.target.value, 0, 12) })} /></label><label>Pecado<input type="number" min="0" max="30" value={sheet.sin} onChange={e => update({ sin: clamp(e.target.value, 0, 30) })} /></label><label>Marcas<input type="number" min="0" max="6" value={sheet.sinMarks} onChange={e => update({ sinMarks: clamp(e.target.value, 0, 6) })} /></label><label>Caixas perdidas<input type="number" min="0" max="10" value={sheet.lostSinBoxes} onChange={e => update({ lostSinBoxes: clamp(e.target.value, 0, 10) })} /></label><label>Bônus cap. Pecado<input type="number" value={sheet.sinCapBonus} onChange={e => update({ sinCapBonus: Number(e.target.value) || 0 })} /></label></div>{Number(sheet.sin) >= sinCap && <p className="warning">Overflow no fim da cena: o Pecado atingiu a capacidade.</p>}</Card></div>

    <Card title="Ações rápidas de recurso" ref="p. 27–32"><div className="sheet-actions"><button onClick={() => addStress(1)}>+1 estresse</button><button onClick={() => addStress(2)}>+2 estresse</button><button onClick={() => addStress(3)}>+3 estresse</button><button onClick={() => addStress(1, true)}>+1 não letal</button><button onClick={spendBurstOrSin}>Gastar Burst; se zerado, Pecado d3</button><button onClick={gainSinD3}>Ganhar Pecado d3</button><button onClick={resolveOverflow}>Resolver Overflow</button></div><p className="muted">O botão de estresse já tenta aplicar o rollover da versão 1.3: ao encher o Talismã de Execução, limpa estresse, soma ferimento e continua o excedente. Estresse não letal nunca preenche.</p></Card>

    <Card title="Distribuidor de perícias inicial" ref="p. 44"><p>Escolha duas perícias que sobem para 2 e três que caem para 0; o resto fica 1.</p><div className="grid two compact-grid"><div className="mini"><strong>Duas perícias em 2</strong>{boosts.map((value, idx) => <select key={idx} value={value} onChange={e => setBoosts(arr => arr.map((x,i) => i===idx ? e.target.value : x))}>{skills.map(s => <option key={s.key} value={s.key}>{s.pt}</option>)}</select>)}</div><div className="mini"><strong>Três perícias em 0</strong>{zeros.map((value, idx) => <select key={idx} value={value} onChange={e => setZeros(arr => arr.map((x,i) => i===idx ? e.target.value : x))}>{skills.map(s => <option key={s.key} value={s.key}>{s.pt}</option>)}</select>)}</div></div><button className="primary" onClick={applyInitialSkills}>Aplicar distribuição inicial</button></Card>

    <Card title="Perícias"><div className="skill-grid">{skills.map(s => <label key={s.key}>{s.pt}<input type="number" min="0" max="3" value={skillValues[s.key] ?? 0} onChange={e => updateSkill(s.key, e.target.value)} /><small>{s.hint}</small></label>)}</div></Card>

    <div className="grid two"><Card title="Agenda"><div className="form-grid"><label>Agenda<select value={sheet.agenda} onChange={e => update({ agenda: e.target.value })}>{agendas.map(a => <option key={a.name}>{a.pt} / {a.name}</option>)}</select></label></div><p><strong>{selectedAgenda.pt}:</strong> {selectedAgenda.summary}</p><div className="pill-row">{selectedAgenda.items.map((i, idx) => <span className="pill" key={idx}>{i}</span>)}</div><h4>Adicionar habilidade</h4><div className="choice-list">{selectedAgenda.abilities.map((ab, idx) => <button key={idx} className="choice" onClick={() => addAgendaAbility(ab)}>{ab}</button>)}</div><label>Habilidades escolhidas / carregadas<textarea value={sheet.agendaAbilities} onChange={e => update({ agendaAbilities: e.target.value })} /></label></Card>
    <Card title="Blasfêmia"><div className="form-grid"><label>Blasfêmia<select value={sheet.blasphemy} onChange={e => update({ blasphemy: e.target.value })}>{blasphemies.map(b => <option key={b.name}>{b.pt} / {b.name}</option>)}</select></label><label>Blasfêmias extras<input type="number" min="0" max="11" value={sheet.extraBlasphemies} onChange={e => update({ extraBlasphemies: clamp(e.target.value, 0, 11) })} /></label></div><p><strong>{selectedBlasphemy.pt}:</strong> {selectedBlasphemy.concept}</p><p><strong>Passiva:</strong> {selectedBlasphemy.passive}</p><h4>Adicionar poderes</h4><div className="choice-list">{selectedBlasphemy.powers.map((power, idx) => <button key={idx} className="choice" onClick={() => addBlasphemyPower(power)}>{power[0]} — {power[1]}</button>)}</div><label>Poderes escolhidos<textarea value={sheet.blasphemyPowers} onChange={e => update({ blasphemyPowers: e.target.value })} placeholder="Comece com 2 poderes da blasfêmia. Todos também têm Blast." /></label></Card></div>

    <div className="grid two"><Card title="Progressão" ref="p. 45"><div className="form-grid"><label>XP<input type="number" min="0" max="20" value={sheet.xp} onChange={e => update({ xp: clamp(e.target.value, 0, 20) })} /></label><label>Avanços guardados<input type="number" min="0" max="20" value={sheet.advances} onChange={e => update({ advances: clamp(e.target.value, 0, 20) })} /></label><label>Scrip<input type="number" min="0" max="999" value={sheet.scrip} onChange={e => update({ scrip: clamp(e.target.value, 0, 999) })} /></label><label>Missões sobrevividas<input type="number" min="0" max="99" value={sheet.missions} onChange={e => update({ missions: clamp(e.target.value, 0, 99) })} /></label><label>KP Máx.<input type="number" min="0" max="20" value={sheet.maxKit} onChange={e => update({ maxKit: clamp(e.target.value, 0, 20) })} /></label><label>KP gasto<input type="number" min="0" max="20" value={sheet.kitSpent} onChange={e => update({ kitSpent: clamp(e.target.value, 0, 20) })} /></label></div><p className="muted">{nextCategoryText(Number(sheet.missions || 0))}</p><h4>Checklist de XP da sessão</h4><div className="form-grid"><label className="check"><input type="checkbox" checked={!!sheet.xpSurvived} onChange={e => update({ xpSurvived: e.target.checked })} /> Sobreviveu</label><label className="check"><input type="checkbox" checked={!!sheet.xpAgenda} onChange={e => update({ xpAgenda: e.target.checked })} /> Seguiu 1º item da agenda</label><label className="check"><input type="checkbox" checked={!!sheet.xpBold} onChange={e => update({ xpBold: e.target.checked })} /> Cumpriu item em negrito</label><label className="check"><input type="checkbox" checked={!!sheet.xpInjury} onChange={e => update({ xpInjury: e.target.checked })} /> Sofreu ferimento/aflição</label></div><button className="primary" onClick={addXpFromChecklist}>Adicionar XP do checklist</button></Card>
    <Card title="Gastar avanços"><p>Use depois da sessão. O site não obriga regras; ele ajuda a registrar.</p><div className="choice-list"><button className="choice" onClick={() => update({ advances: Math.max(0, Number(sheet.advances || 0) - 1) })}>Marcar 1 avanço gasto</button><button className="choice" onClick={() => update({ scrip: Number(sheet.scrip || 0) + 3, advances: Math.max(0, Number(sheet.advances || 0) - 1) })}>Avanço → +3 Scrip</button><button className="choice" onClick={() => update({ extraBlasphemies: Number(sheet.extraBlasphemies || 0) + 1, advances: Math.max(0, Number(sheet.advances || 0) - 1) })}>Avanço → nova blasfêmia</button></div><p className="muted">Outras opções: nova habilidade de agenda, novo poder de blasfêmia, evoluir marca de pecado ou aumentar perícia em +1 respeitando os limites.</p></Card></div>

    <div className="grid two"><Card title="Hooks, aflições e marcas"><label>Hooks<textarea value={sheet.hooks} onChange={e => update({ hooks: e.target.value })} placeholder="Nome do hook — cortes 0/3 — consequência" /></label><label>Aflições<textarea value={sheet.afflictions} onChange={e => update({ afflictions: e.target.value })} /></label><label>Marcas de Pecado<textarea value={sheet.sinMarkNotes} onChange={e => update({ sinMarkNotes: e.target.value })} /></label></Card><Card title="Kit, armas e notas"><label>Kit comprado / itens disponíveis<textarea value={sheet.kit} onChange={e => update({ kit: e.target.value })} /></label><label>Itens puxados nesta missão<textarea value={sheet.kitUsed || ''} onChange={e => update({ kitUsed: e.target.value })} /></label><label>Armas<textarea value={sheet.weapons} onChange={e => update({ weapons: e.target.value })} /></label><label>Notas<textarea value={sheet.notes} onChange={e => update({ notes: e.target.value })} /></label></Card></div>
  </section>
}
function defaultSheet() { return { localId: '', id: '', name: '', player: '', pronouns: '', look: '', creation: { manifestation: '', sinSeed: '', hiddenTruth: '', hand: '', mother: '' }, category: 1, maxStressBonus: 0, stress: 0, injuries: 0, pathos: 0, psycheBursts: 3, sin: 0, sinMarks: 0, lostSinBoxes: 0, sinCapBonus: 0, skills: { ...defaultSkills }, agenda: agendas[0].name, blasphemy: blasphemies[0].name, extraBlasphemies: 0, agendaAbilities: '', blasphemyPowers: '', xp: 0, advances: 0, scrip: 0, missions: 0, maxKit: 5, kitSpent: 0, hooks: '', afflictions: '', sinMarkNotes: '', kit: '', kitUsed: '', weapons: '', notes: '', xpSurvived: false, xpAgenda: false, xpBold: false, xpInjury: false } }

createRoot(document.getElementById('root')).render(<App />)
