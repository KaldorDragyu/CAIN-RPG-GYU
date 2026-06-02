
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
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

function App() {
  const [active, setActive] = useState('home')
  const [query, setQuery] = useState('')
  const activeLabel = navItems.find(i => i.id === active)?.label ?? 'CAIN'
  const page = useMemo(() => ({
    home: <Home setActive={setActive} />,
    rules: <RulesPage />,
    creation: <CreationPage />,
    agendas: <AgendasPage query={query} />,
    blasphemies: <BlasphemiesPage query={query} />,
    kit: <KitPage />,
    hunt: <HuntPage />,
    admin: <AdminPage />,
    sins: <SinsPage query={query} />,
    opponents: <OpponentsPage />,
    tools: <ToolsPage />,
    sheet: <CharacterSheet />
  }[active] || <Home setActive={setActive} />), [active, query])

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand-block"><div className="triangle-mark">▽</div><p className="eyebrow">Wipe out the stain</p><h1>CAIN 1.3</h1><p>Referência PT-BR de mesa</p></div>
      <nav>{navItems.map(item => <button key={item.id} className={active === item.id ? 'active' : ''} onClick={() => setActive(item.id)}>{item.label}</button>)}</nav>
      <div className="sidebar-note"><strong>Busca rápida</strong><input value={query} onChange={e => setQuery(e.target.value)} placeholder="agenda, poder, sin..." /></div>
    </aside>
    <main>
      <header className="topbar"><div><p className="eyebrow">Aba atual</p><h2>{activeLabel}</h2></div><button className="ghost" onClick={() => setActive('sheet')}>Abrir ficha</button></header>
      {page}
      <footer><p>{legalNotice}</p></footer>
    </main>
  </div>
}

function Home({ setActive }) {
  return <section className="stack gap-xl">
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
