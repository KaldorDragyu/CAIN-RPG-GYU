
export const navItems = [
  { id: 'home', label: 'Início' },
  { id: 'rules', label: 'Regras' },
  { id: 'creation', label: 'Criação' },
  { id: 'agendas', label: 'Agendas' },
  { id: 'blasphemies', label: 'Blasfêmias' },
  { id: 'kit', label: 'Kit & Armas' },
  { id: 'hunt', label: 'Caçada' },
  { id: 'admin', label: 'Admin' },
  { id: 'sins', label: 'Pecados' },
  { id: 'opponents', label: 'Oponentes' },
  { id: 'tools', label: 'Ferramentas' },
  { id: 'sheet', label: 'Ficha' }
]

export const legalNotice = 'Companheiro de mesa com resumo em português e ferramentas digitais. Não inclui PDF, artes, páginas escaneadas, layout do livro nem tradução integral. Use o livro comprado para leitura aprofundada e publique apenas de forma privada/limitada ao seu grupo.'

export const sourceMap = [
  { section: 'Regras centrais', pages: 'p. 10–19' },
  { section: 'Exorcista, corpo, pecado, hooks e kit básico', pages: 'p. 20–33' },
  { section: 'Caçada, descanso, tensão, pressão, execução e conflitos', pages: 'p. 34–45' },
  { section: 'Agendas', pages: 'p. 46–51' },
  { section: 'Blasfêmias, tags e avanço', pages: 'p. 52–77' },
  { section: 'Kit expandido, armas e marcas de pecado', pages: 'p. 78–87' },
  { section: 'Admin, segurança e criação de investigação', pages: 'p. 89–99' },
  { section: 'Pecados, domínios, trauma e talismã de execução', pages: 'p. 101–109' },
  { section: 'Tipos de Pecado: Ogre, Idol, Hound, Centipede, Toad e Lord', pages: 'p. 110–145' },
  { section: 'Outros oponentes, mundanos e Binders', pages: 'p. 146–153' }
]

export const skills = [
  { key: 'force', pt: 'Força', original: 'Force', hint: 'Violência direta, combate corpo a corpo, agarrar, quebrar, empurrar e esmagar.' },
  { key: 'conditioning', pt: 'Condicionamento', original: 'Conditioning', hint: 'Correr, escalar, nadar, equilibrar-se, atravessar ambientes perigosos e suportar esforço.' },
  { key: 'coordination', pt: 'Coordenação', original: 'Coordination', hint: 'Atirar, arremessar, pegar, reflexos manuais e precisão mão-olho.' },
  { key: 'covert', pt: 'Furtividade', original: 'Covert', hint: 'Mover-se sem ser visto, abrir fechaduras, furtar, infiltrar-se e agir sem chamar atenção.' },
  { key: 'interfacing', pt: 'Interface', original: 'Interfacing', hint: 'Usar, consertar, dirigir, hackear ou adaptar tecnologia, veículos e dispositivos.' },
  { key: 'surveillance', pt: 'Vigilância', original: 'Surveillance', hint: 'Observar, rastrear, seguir alvos, mapear rotas e encontrar sinais no ambiente.' },
  { key: 'investigation', pt: 'Investigação', original: 'Investigation', hint: 'Pesquisar, estudar detalhes, decifrar informações, analisar substâncias, registros e símbolos.' },
  { key: 'authority', pt: 'Autoridade', original: 'Authority', hint: 'Liderar, ordenar, organizar, intimidar e impor presença profissional ou institucional.' },
  { key: 'negotiation', pt: 'Negociação', original: 'Negotiation', hint: 'Convencer, mentir, barganhar, acalmar e manipular por carisma e conversa.' },
  { key: 'connection', pt: 'Conexão', original: 'Connection', hint: 'Entender pessoas, acionar contatos, empatia, rede social, favores e leitura emocional.' }
]

export const categoryRows = [
  { cat: 0, label: 'Humano', people: '1 pessoa', size: 'humano', area: 'pessoal', range: 'toque', speed: 'humano comum', magnitude: 'pequeno' },
  { cat: 1, label: 'Imp', people: 'poucas pessoas', size: 'mobília pesada', area: 'algumas pessoas', range: 'mesma sala', speed: 'humano rápido', magnitude: 'notável' },
  { cat: 2, label: 'Geist', people: 'grupo pequeno', size: 'animal grande', area: 'sala inteira', range: 'do outro lado da rua', speed: 'animal rápido', magnitude: 'grande' },
  { cat: 3, label: 'Revenant', people: 'grupo grande', size: 'carro', area: 'algumas salas', range: 'fim do quarteirão', speed: 'carro', magnitude: 'muito grande' },
  { cat: 4, label: 'Wraith', people: 'multidão', size: 'veículo grande', area: 'prédio inteiro', range: 'alguns quarteirões', speed: 'trem', magnitude: 'massivo' },
  { cat: 5, label: 'Demon', people: 'multidão enorme', size: 'prédio', area: 'quarteirão', range: 'do outro lado da cidade', speed: 'maglev', magnitude: 'destrutivo' },
  { cat: 6, label: 'God', people: 'milhares', size: 'prédio grande', area: 'bairro', range: 'alcance visual', speed: 'avião', magnitude: 'avassalador' },
  { cat: 7, label: 'Demon God', people: 'dezenas de milhares', size: 'arranha-céu', area: 'cidade', range: 'além do horizonte', speed: 'caça supersônico', magnitude: 'cataclísmico' }
]

export const quickRules = [
  { title: 'Quando rolar', ref: 'p. 10–11', body: 'Role apenas se a ação for incerta, contestada, perigosa ou importante para a cena. Se não houver tensão real, apenas diga o que acontece.' },
  { title: 'Parada de ação', ref: 'p. 11', body: 'Some uma perícia comum de 0–3 dados com até +3D de vantagem. Com 0 dados, role 2d6 e use o menor. Cada dado 4+ é sucesso; em ação Difícil, só 6 conta.' },
  { title: 'Difícil e impossível', ref: 'p. 11, 18–19', body: 'Ações acima da capacidade, sem ferramentas, sob pressão ou contra alvo de CAT superior podem ser Difíceis. Se a diferença ou a circunstância for absurda, o Admin pode dizer que é impossível até a ficção mudar.' },
  { title: 'Risco', ref: 'p. 12', body: 'Em ação arriscada, o Admin rola 1d6 junto: 1 muito pior; 2–3 pior; 4–5 esperado; 6 melhor. O risco pode complicar até uma ação bem-sucedida.' },
  { title: 'Consequências', ref: 'p. 14–15', body: 'Custos comuns: atenção, tempo, equipamento, segurança, efetividade, oportunidade, separação, escolha difícil, hook ou estresse.' },
  { title: 'Setup e equipe', ref: 'p. 15–16', body: 'Setup bem-sucedido dá +1D, reduz dificuldade ou reduz risco da próxima ação ligada. Em equipe, um líder rola usando os melhores recursos do grupo, mas todos aceitam as consequências.' },
  { title: 'Pathos e Agonia Divina', ref: 'p. 16', body: 'Ganhe 1 pathos ao falhar totalmente, sofrer ferimento/aflição, preencher hook ou ver morte/overflow. Até 3. Queime tudo uma vez por sessão para +1D por pathos, ultrapassando o limite normal de vantagem.' },
  { title: 'Talismãs', ref: 'p. 17, 93', body: 'Tarefas complexas usam talismãs. Cada sucesso marca 1 corte. Simples: 1–2; médio: 3–5; complexo: 6–8. Use nomes descritivos, não comandos.' },
  { title: 'Categoria', ref: 'p. 18–19', body: 'CAT mede escala. Três ou mais categorias abaixo geralmente nem exige rolagem; três ou mais acima pode ser impossível. Equipamento mundano contra Pecados é sempre Difícil.' }
]

export const creationSteps = [
  { title: '1. Responda as perguntas estranhas', ref: 'p. 44', body: 'Como os poderes surgiram? O sin-seed está no cérebro ou coração? O que você esconde? Sua mão é sua? Você lembra o rosto da sua mãe?' },
  { title: '2. Preencha identidade e aparência', ref: 'p. 21, 44', body: 'Nome, ID interno, jogador, visual, pronomes, detalhes e qualquer coisa que ajude o Admin a puxar drama.' },
  { title: '3. Distribua perícias', ref: 'p. 44', body: 'Comece todas as 10 perícias em 1. Aumente duas para 2. Reduza três para 0. Máximo inicial normal é 2.' },
  { title: '4. Escolha agenda', ref: 'p. 46–51', body: 'Escolha uma agenda e uma habilidade inicial. A agenda dá XP, estilo de jogo e habilidades futuras.' },
  { title: '5. Escolha blasfêmia', ref: 'p. 52–77', body: 'Escolha uma blasfêmia principal e dois poderes dela. Todos também têm Blast como poder básico.' },
  { title: '6. Comece a primeira caçada', ref: 'p. 34–45', body: 'Você inicia uma caçada com 3 psyche bursts, kit cheio, sem ferimentos, sem hooks e sem estresse marcado.' }
]

export const exorcistRules = [
  { title: 'PSYCHE', ref: 'p. 25–27', items: ['Perícia especial igual a metade da CAT arredondada para cima.', 'Usada para poderes e usos criativos de blasfêmias.', 'Não sobe por XP diretamente; sobe com Categoria.'] },
  { title: 'Psyche Burst', ref: 'p. 27', items: ['Começa cada caçada com 3.', 'Gasta para ativar poderes ou dar +1D narrando como a blasfêmia ajuda.', 'Pode ser recuperado com descanso ou habilidades.', 'Se faltar burst, você pode ganhar pecado em vez disso.'] },
  { title: 'Blast', ref: 'p. 27, 52', items: ['Poder básico de todo exorcista.', 'Gaste burst e role PSYCHE para causar energia psíquica em corpo a corpo ou curto alcance.', 'Conta como sobrenatural e escala com CAT.'] },
  { title: 'Pecado e overflow', ref: 'p. 29–30', items: ['Ganhe 1d3 pecado em vez de gastar burst.', 'Ao atingir a capacidade de pecado, o overflow ocorre no fim da cena.', 'Pode desistir e virar ameaça sob controle do Admin, ou resistir.', 'Para resistir: role 1d6 + marcas de pecado. Sem marcas passa automaticamente; 6 ou menos passa; 7+ falha; 1 natural sempre passa.', 'Ao resistir, limpa pecado, perde permanentemente duas caixas de pecado e ganha uma marca.'] },
  { title: 'Estresse e ferimentos', ref: 'p. 31–32', items: ['Talismã de Execução começa com 6 cortes.', 'Quando enche, limpa os cortes e vira 1 ferimento; estresse excedente rola para preencher de novo.', 'Estresse não letal nunca preenche completamente; sempre deixa 1 espaço livre.', 'Cada ferimento reduz o máximo de estresse em 1.', 'Com 3 ferimentos, qualquer novo estresse causa morte instantânea.'] },
  { title: 'Hooks e barganha', ref: 'p. 32–33', items: ['Hook é um talismã de 3 cortes com consequência futura.', 'Corta quando tensão enche, quando sai 1 no dado de risco ou quando o hook seria ganho de novo.', 'Ao preencher, o Admin pode cobrar a consequência agravada.', 'Jogadores podem propor hooks em troca de +1D, reduzir risco/dificuldade, burst gratuito ou corte extra em talismã.'] },
  { title: 'Avanço', ref: 'p. 45, 53', items: ['No fim da sessão: +1 XP por sobreviver, cumprir item normal de agenda, cumprir item em negrito, sofrer ferimento/aflição.', '4 XP viram 1 avanço.', 'Avanço compra habilidade de agenda, poder de blasfêmia/nova blasfêmia, evolução de marca, 3 scrip ou +1 perícia.', 'CAT 2 após 1 missão; CAT 3 após 2; CAT 4 após 4; CAT 5 após 7.'] }
]

export const agendas = [
  { name: 'Beast', pt: 'Besta', ref: 'p. 46', items: ['Entrar em briga', 'Segurar a fera'], summary: 'Resolve problemas com violência direta, mas ganha XP quando se controla.', abilities: ['+1D para ferir humanos.', 'Recupera burst ao sofrer ferimento, hook preenchido ou aflição.', 'Em violência, dois ou mais 6 dão corte extra e recuperam burst.', 'Pode tomar 2 estresse não letal para +1D em ação violenta/forçosa.', 'Com 2+ ferimentos/aflições, força humana deixa de ser Difícil contra sobrenatural e escala parcialmente com CAT.'] },
  { name: 'Doomed', pt: 'Condenado', ref: 'p. 46', items: ['Demonstrar humanidade', 'Demonstrar distância da humanidade'], summary: 'Agenda para quem carrega marca de pecado e aceita a mutação como ferramenta.', abilities: ['Ignora resultados 1 ao ganhar pecado.', 'Escolhe uma marca para evoluir e ela deixa de piorar resistência.', '+1D quando ganha 2+ pecado numa ação.', 'Pode dar temporariamente uma habilidade de marca a um aliado ao custo de pecado.', 'Pode ganhar pecado para rerrolar habilidade de uma marca.'] },
  { name: 'Firebug', pt: 'Incendiário', ref: 'p. 47', items: ['Resolver criativamente', 'Escolher solução simples'], summary: 'Improvisador, técnico, arrombador, gambiarreiro de missão.', abilities: ['Uma perícia 0 vira 1 durante a missão.', 'Sempre encontra uma entrada/saída, mas com custo escolhido pelo Admin.', 'Começa com kit points extras.', 'Gasta KP para +1D em consertar, criar, quebrar ou modificar máquinas.', 'Marca ponto fraco para dar +1D e corte extra ao aliado.'] },
  { name: 'Guardian', pt: 'Guardião', ref: 'p. 47', items: ['Proteger seu povo', 'Não deixar ninguém para trás'], summary: 'Tanque emocional e físico do grupo.', abilities: ['Pode redirecionar consequências de um protegido para si.', 'Quando pressão sobe, apaga estresse se estiver muito ferido.', 'Quando aliado sofre ferimento, apaga estresse e ganha +1D na próxima ação.', 'No descanso, aliados podem usar seus resultados de dados.', 'Primeiro ferimento não reduz máximo de estresse.'] },
  { name: 'Loner', pt: 'Solitário', ref: 'p. 47', items: ['Mostrar superioridade', 'Deixar a máscara cair'], summary: 'Especialista frio que opera sozinho, mas ainda salva os outros quando precisa.', abilities: ['Estresse excedente não rola quando vira ferimento.', '+1D contra alvos desprevenidos.', 'Uma vez por cena, pode interferir em falha de outro, ganhando estresse não letal e adicionando 1D.', 'Ao preparar um aliado, pode sofrer estresse para preparar outro também.', 'Pode ignorar um ferimento com um hook perigoso que leva a morte inevitável se preencher.'] },
  { name: 'Hardline', pt: 'Linha-Dura', ref: 'p. 48', items: ['Seguir ordens', 'Desobedecer ordens'], summary: 'Operativo de CAIN disciplinado, útil contra autoridades e Pecados enfraquecidos.', abilities: ['+1D para liderar, intimidar ou ordenar humanos mundanos.', 'Primeira lesão/aflição da caçada reduz pecado.', 'Contra Pecado com metade ou menos do talismã, primeiro ataque ganha +1D e corte extra.', 'Só pode manter uma aflição por vez.', 'Uma vez por caçada, ao ver evidência de domínio, exige a regra exata do domínio.'] },
  { name: 'Machine', pt: 'Máquina', ref: 'p. 48', items: ['Colocar o trabalho antes de si', 'Fazer uma pausa'], summary: 'Agenda extrema para quem virou instrumento morto de trabalho; ligada a exorcistas realmente mortos.', abilities: ['Pode ganhar +1D, mas sofre estresse crescente por uso e perde acesso se descansar.', 'Em pesquisa/investigação, sofre estresse não letal para rerrolar um dado.', 'Quando pressão chega a 4, remove todo estresse ou uma aflição.', '+1D em investigação por cena, mas todo o resto fica Difícil até descansar.', 'Duas vezes por caçada, move em 1 corte um talismã seu ou de aliado fora de conflito.'] },
  { name: 'Moth', pt: 'Mariposa', ref: 'p. 49', items: ['Descobrir verdades ocultas do mundo', 'Descobrir verdades ocultas sobre si'], summary: 'Investigador que flerta com o proibido e com o próprio colapso.', abilities: ['Primeira resposta de trauma recupera burst, reduz pecado e apaga estresse.', '+2 na capacidade de overflow.', 'Apaga estresse quando ganha aflição, ferimento ou hook.', 'Ganha XP se termina missão com pecado alto ou sofre overflow.', 'Pergunta ao Admin o medo de alguém e ganha +1D ao agir sobre a resposta.'] },
  { name: 'Temperance', pt: 'Temperança', ref: 'p. 49', items: ['Pôr pessoas antes da missão', 'Ferir alguém intencionalmente'], summary: 'Cuidador, médico, pacificador e peso moral da equipe.', abilities: ['Primeiro descanso ganha dado extra.', 'Uma vez por caçada, poder que afeta só você/aliados não gasta burst e ganha +1 CAT.', '+1D para impedir dano a humanos.', 'Uma vez por caçada, aplica dado de descanso fora de descanso.', 'Por uma cena, reduz estresse recebido em 1 até tomar ação ofensiva.'] },
  { name: 'Torch', pt: 'Tocha', ref: 'p. 49–50', items: ['Liderar da frente', 'Deixar outro liderar'], summary: 'Inspira aliados, divide poder e transforma o grupo numa arma.', abilities: ['Rolagens 0D nunca são Difíceis.', 'Primeira ação em conflito ganha +1D e corte extra.', 'Ganha bursts extras que só aliados podem gastar até você descansar.', 'Dá 1 XP a alguém que te impressionou na sessão.', 'Uma vez por caçada, rerrola completamente uma ação sua ou de aliado.'] },
  { name: 'Survivor', pt: 'Sobrevivente', ref: 'p. 50', items: ['Sobreviver'], summary: 'Agenda-tema minimalista: continuar vivo acima de tudo.', abilities: ['+1 máximo de estresse.', 'Ao sofrer morte instantânea, role 1d6; em 6 ignora. Trocar para fora pode exigir custo especial.'] },
  { name: 'Shadow', pt: 'Sombra', ref: 'p. 50', items: ['Superar seu rival', 'Deixar seu rival te superar'], summary: 'Rivalidade como combustível mecânico e dramático.', abilities: ['Se rival está melhor quando pressão sobe, recupera estresse/burst.', 'Setup no rival causa estresse não letal e ganha +1D.', 'Uma vez por caçada, sofre estresse para impedir ferimento/morte do rival.', 'Copia um poder do rival por uma caçada em CAT 0.', 'Em trabalho em equipe com rival, sofre estresse e rerrola um dado.'] },
  { name: 'Sorcerer', pt: 'Feiticeiro', ref: 'p. 50', items: ['Exibir poder chamativo', 'Convidar catástrofe'], summary: 'Especialista em blasfêmias, potência e técnica perigosa.', abilities: ['Uma vez por caçada, uma blasfêmia ganha +1 CAT por cena/duas rodadas.', 'Um poder escolhido pode ser usado duas vezes sem burst, mas limitado a CAT 0.', 'Finishing move aumenta dado e CAT de um poder; depois não usa blasfêmias e tudo fica Difícil até descansar.', 'Aprende um poder de qualquer blasfêmia sem pegar a blasfêmia inteira.', 'Ao usar uma blasfêmia, fortalece a próxima de um aliado contra o mesmo alvo.'] },
  { name: 'Songbird', pt: 'Pássaro-Canoro', ref: 'p. 51', items: ['Fazer alguém obedecer', 'Fazer algo altruísta'], summary: 'Manipulador social, dependência, fascínio e mentiras úteis.', abilities: ['Quando alguém te prepara, transfere 1 estresse entre vocês.', 'Sempre sabe se alguém está mentindo, mas não necessariamente o quê.', 'Descanso com parceiro consentido melhora descanso, mas cria uma cobrança futura.', 'Sofre estresse não letal para +1D em mentira/manipulação.', 'Declara fascínio por alguém; seus riscos 6/1 aliviam ou causam estresse em você.'] },
  { name: 'Departed', pt: 'Falecido', ref: 'p. 48', items: ['Apoiar depois da morte'], summary: 'Opção narrativa para morto continuar assombrando a mesa de forma limitada.', abilities: ['Uma vez por sessão, um personagem morto pode interferir quando aliado rola e permitir rerrolagem completa, mantendo o segundo resultado.'] }
]

export const powerTags = [
  { group: 'Duração', tags: ['Instantâneo', 'Até descansar', '1 cena', 'Caçada inteira'] },
  { group: 'Alcance', tags: ['Pessoal', 'Adjacente', 'Curto', 'Longo', 'Extremo', 'CAT/CAT+'] },
  { group: 'Efeito', tags: ['Maldição', 'Encanto', 'Transmutação', 'Invocação'] }
]

export const blasphemies = [
  { name: 'Tension', pt: 'Tensão', ref: 'p. 54–55', concept: 'Projeta campos de força densos para bloquear, cortar, conter e deformar matéria.', passive: 'Iron Soul: uma vez até descansar, ao preencher seu talismã de execução, chance de ignorar o ferimento e ficar a 1 corte do máximo.', powers: [
    ['Stasis', 'Prende você ou grupo CAT em uma “pele” rígida: paralisa e protege de efeitos externos até a cena acabar.'],
    ['Aegis', 'Intervém contra dano externo em você/aliado visível; respostas narrativas viram dados que reduzem estresse.'],
    ['Severance', 'Transforma uma borda em corte sobrenatural; PSYCHE para cortar alvo/objeto até CAT.'],
    ['Malleate', 'Amolece matéria não viva em elástico, lama ou líquido, mudando risco/dificuldade.'],
    ['Fortress', 'Cria plano de força com talismã 2+CAT que bloqueia matéria e energia.']
  ]},
  { name: 'Ardence', pt: 'Ardência', ref: 'p. 56–57', concept: 'Converte energia potencial em calor, frio, vácuo, explosões e clima extremo.', passive: 'Inner Furnace: pode aumentar CAT dos poderes ganhando hook instável; se o hook estourar, o corpo queima por dentro.', powers: [
    ['Void', 'Cria vácuo e trovão numa área CAT; puxa objetos, derruba pessoas e desestabiliza Sins/veículos.'],
    ['Fury', 'Explosão de energia em longo alcance; quanto mais aceita dano indiscriminado/raiva, mais perigoso e amplo fica.'],
    ['Hell', 'Transforma área CAT+2 em zona de calor/frio persistente, de incômodo a letal.'],
    ['Sabre', 'Feixe destrutivo em linha reta que atravessa obstáculos; pode sobrecarregar para cortes extras sofrendo estresse inevitável.'],
    ['Storm', 'Gasta bursts para alterar microclima: céu limpo, chuva, frio, neblina ou vendaval durante a caçada.']
  ]},
  { name: 'Flux', pt: 'Fluxo', ref: 'p. 58–59', concept: 'Manipula o fluxo do tempo, cura, repete eventos e cria instabilidade temporal.', passive: 'Steal Time: uma vez por caçada, rerrola todos os dados de descanso de você ou aliado.', special: 'Muitos poderes geram Temporal Instability, um hook com efeitos estranhos quando preenche.', powers: [
    ['Reversal', 'Reverte um objeto até CAT ao estado de até 1 hora atrás; pode causar impacto se atravessar algo.'],
    ['Schism', 'Cria bolha temporal mostrando um dia no passado/futuro dentro da área CAT.'],
    ['Stop', 'Gasta até 3 bursts para parar o tempo local por segundos rolados; depois ganha instabilidade.'],
    ['Quickening', 'Cura estresse ou estabiliza grupos de humanos feridos; depois ganha instabilidade.'],
    ['Stutter', 'Depois de ver uma rolagem sua/aliada, força rerrolagem completa; uso repetido piora instabilidade.']
  ]},
  { name: 'Vector', pt: 'Vetor', ref: 'p. 60–61', concept: 'Impõe velocidade, impulso e gravidade distorcida a corpos e objetos.', passive: 'Brake: projéteis perdem velocidade contra você, reduzindo estresse vindo deles.', powers: [
    ['Lift', 'Você e grupo CAT caminham por paredes, reduzem queda e planam.'],
    ['Fling', 'Com toque, arremessa ou freia alvo/objeto; tamanho + distância até CAT+2.'],
    ['Current', 'Cria corrente persistente que empurra numa direção; ajuda quem vai junto e dificulta quem resiste.'],
    ['Bullet', 'Dispara balas de ar pressurizado em alcance CAT+1; bônus de altura ou tiro para desarmar/desabilitar.'],
    ['Finesse', 'Manipula à distância pequenos objetos com “mãos” vetoriais em alcance parcial de CAT.']
  ]},
  { name: 'Gate', pt: 'Portal', ref: 'p. 62–63', concept: 'Dobra espaço, cria atalhos, bolsos extradimensionais e arquitetura impossível.', passive: 'Pocket: roupa ganha bolso extradimensional, +1 KP e espaço oculto para itens.', powers: [
    ['Pinch', 'Puxa alvo visível até você comprimindo espaço; tamanho + distância até CAT+2.'],
    ['Tear', 'Cria portal entre dois pontos visíveis em alcance CAT, permitindo passagem de coisas até 1/2 CAT.'],
    ['Bloom', 'Invoca duplicatas de braços/mãos em superfícies de curto alcance para agir através delas.'],
    ['Transmission', 'Teleporte em alcance CAT+2; respostas negativas geram risco de chegar errado e sofrer estresse.'],
    ['Maze', 'Reorganiza estrutura construída em área CAT: portas, janelas, corredores, gravidade e cômodos; o Admin pode ganhar uso contra você.']
  ]},
  { name: 'Smother', pt: 'Abafar', ref: 'p. 64–65', concept: 'Suprime propriedades do mundo: peso, reconhecimento, tecnologia, atrito, som e luz.', passive: 'Absentia: pode aumentar CAT de poderes Smother, mas ganha hook que pode remover partes do corpo.', powers: [
    ['Hollow', 'Remove peso de alvo/objeto até CAT, abrindo usos criativos e bônus narrativo.'],
    ['Abstract', 'Remove função e reconhecimento de objetos: armas não atiram, portas não abrem, janelas não servem.'],
    ['Dark Age', 'Campo móvel que desliga até três categorias: eletricidade, internet, motores, água, mecanismos ou fogo.'],
    ['Smooth', 'Remove atrito de área/grupo CAT, tornando tudo escorregadio e difícil de atravessar.'],
    ['Blind', 'Alvo ou local deixa de produzir som/refletir luz; pode filtrar entrada/saída de som e luz.']
  ]},
  { name: 'Whisper', pt: 'Sussurro', ref: 'p. 66–67', concept: 'Sua sombra sabe o futuro, fareja destinos e responde com verdades perigosas.', passive: 'Shadow: uma entidade invisível acompanha você, fala telepaticamente e conhece futuros, mas interagir com ela causa estresse se não for por poder.', powers: [
    ['Omen', 'Pergunta “o que acontece se eu fizer X?”; pré-rola o dado de risco e dá +1D ao agir sobre a resposta.'],
    ['Shiver', 'Pulso em área CAT para localizar pessoa, objeto, lugar, Sin ou exorcista por sensação fria.'],
    ['Precognition', 'Flashback em que você preparou algo para o presente; pode alterar detalhes plausíveis da cena.'],
    ['Dissect', 'Interroga sua sombra sobre humano/exorcista: mentira, emoção, origem recente, destino planejado.'],
    ['Omnipresence', 'Se aliado está em cena em alcance CAT+2, você chega “porque previu”, com opções por sucesso.']
  ]},
  { name: 'Edit', pt: 'Editar', ref: 'p. 68–69', concept: 'Puxa realidades alternativas para alterar aparência, status, pessoas, objetos e salas.', passive: 'Mimic: ao descansar, altera aparência dentro de variação humana, sem mudar perícias nem esconder marcas.', powers: [
    ['Uniform', 'Em privacidade, vira membro oficial de grupo/profissão com uniforme, documentos e equipamento plausível.'],
    ['Absurd', 'Troca CAT humanos/exorcistas por versões alternativas de si mesmos, mudando aparência/roupa.'],
    ['Copy', 'Cria doppelgänger obediente de humano/exorcista, frágil, limitado e sem poderes.'],
    ['Utility', 'Faz surgir objeto/veículo mundano genérico em curto alcance sem gastar KP, com defeitos escolhidos pelo Admin.'],
    ['Filter', 'Campo numa sala: transparência/opacidade, luz, telecinese local e desmontagem/remontagem de objetos.']
  ]},
  { name: 'Bind', pt: 'Vincular', ref: 'p. 70–71', concept: 'Vincula um Sin menor como servo, montaria, ferramenta sensorial, arma e prisão.', passive: 'Sin Binding: você tem um Sin menor animalístico, invisível a humanos, obediente e vulnerável; age por seus comandos.', powers: [
    ['Horde Spirit', 'Seu Sin vira veículo/criatura montável CAT por cena e ganha bônus em travessia/movimento.'],
    ['Forbidden Spirit', 'Libera forma monstruosa para ação poderosa, +1D e escala CAT+1; pode ignorar estresse uma vez.'],
    ['Hunter Spirit', 'Seu Sin voa, vê/cheira muito bem, se afasta em alcance extremo e compartilha sentidos.'],
    ['Surrender', 'Funde-se parcialmente ao Sin e ganha marca temporária; overflow resistido pode torná-la permanente.'],
    ['Penumbra', 'Cria círculo-prisão CAT+1 que bloqueia entrada/saída de Sins, humanos ou exorcistas conforme escolhido.']
  ]},
  { name: 'Palace', pt: 'Palácio', ref: 'p. 72–73', concept: 'Sua mente é uma mansão psíquica onde descanso, simulação e encontros acontecem.', passive: 'Sanctum: você e aliados descansando podem entrar no palácio; melhora dados de descanso de você e um aliado.', powers: [
    ['Library', 'Acessa biblioteca psíquica para +1D em pesquisa, com risco de estresse por informação rara/proibida/perigosa.'],
    ['Cellar', 'Simula treino no palácio para preparar aliados à distância; falha pode ser rerrolada com estresse.'],
    ['Parlor', 'Chama consciência ou cópia psíquica de pessoas para dentro do palácio por uma cena.'],
    ['Bar', 'Abre uma porta para um bar físico; descanso nele cura estresse, hooks ou ferimento conforme cargas.'],
    ['Foyer', 'Ganha tulpa/servo: ajuda pesquisa/criação/investigação ou manifesta-se como pessoa CAT 0.']
  ]},
  { name: 'Jaunt', pt: 'Excursão', ref: 'p. 74–75', concept: 'Separa corpo, percepção, alma e presença, permitindo possessão e projeção.', passive: 'Ghostwire: cria rede telepática com pessoas tocadas até CAT, enquanto estiverem em longo alcance.', powers: [
    ['Possession', 'Projeta percepção em humano, animal ou cadáver em curto alcance por cena; seu corpo fica indefeso.'],
    ['Geist', 'Forma psíquica invisível voa, atravessa paredes e não interage com mundo físico.'],
    ['Threads', 'Vê rastros de graça e seres vivos através de paredes, mas fica cego para matéria inanimada.'],
    ['Passenger', 'Puxa presenças psíquicas voluntárias para seu corpo; elas podem agir usando suas próprias perícias.'],
    ['Desecrate', 'Anima memórias de cadáveres tocando os olhos e faz três perguntas no total.']
  ]},
  { name: 'Sympathy', pt: 'Simpatia', ref: 'p. 76–77', concept: 'Lê e amplifica impressões humanas em objetos, ferramentas e armas.', passive: 'Resonance: rola ressonâncias de objetos; usando item ressonante ganha +1D. Pode manter até três.', powers: [
    ['Amplify', 'Aumenta propriedades mundanas de item não-arma até escala CAT por uma cena.'],
    ['Alliance', 'Objeto até CAT age para preparar aliado, rolando 1d6 ou PSYCHE se ressonante.'],
    ['Bond', 'Vincula item nas mãos, torna-o arma mundana e indestrutível; pode descarregar como ataque sobrenatural CAT.'],
    ['Diplomacy', 'Faz pedido simples ou pergunta sim/não a um objeto, rolando PSYCHE/social se necessário.'],
    ['Psychometry', 'Toca objeto e vê memórias de dias igual CAT, fazendo perguntas por sucesso.']
  ]}
]

export const kitRules = [
  { title: 'Kit básico', ref: 'p. 33', items: ['Todo exorcista começa uma caçada com 5 KP.', 'Você não precisa escolher tudo antes: puxa item da lista quando precisar e marca o custo.', 'Básico: uniforme (0), caderno/caneta (1), fósforos/lenço (1), armas de serviço firearm + melee CAT 0 (2).', 'Itens encontrados na missão podem ser usados gastando KP, mas não ficam entre missões.'] },
  { title: 'Scrip e expansão', ref: 'p. 78–83', items: ['Scrip é gasto entre missões para tornar itens sempre disponíveis no kit.', 'Itens têm custo em scrip e custo em KP para puxar na missão.', 'Tags comuns: Consumable, Conspicuous, Focus e alcance.', 'Use custo aproximado: 0 bolso; 1 mão; 2 arma/item de duas mãos; 3 pesado/mochila; 5 corpo humano.'] },
  { title: 'Armas', ref: 'p. 84–85', items: ['Escolha estética das armas de serviço livremente.', 'Começam em CAT 0.', 'Por 3 scrip, melhora ambas em +1 CAT, máximo CAT 3.', 'Mesmo melhoradas, armas mundanas contra Pecados continuam dependendo de contexto; Blast e blasfêmias são mais confiáveis.'] }
]

export const kitCatalog = [
  { group: 'Aparência', ref: 'p. 79', items: ['uniforme padrão grátis', 'uniforme cassock/habit', 'sapatos confortáveis', 'terno', 'roupa casual sancionada', 'roupa formal', 'sobretudo', 'uniforme cerimonial'] },
  { group: 'Conforto/carreira', ref: 'p. 80', items: ['quarto melhorado', 'quarto privado', 'direito de visita', 'regras de aparência relaxadas', 'plano de refeição melhor', 'indulgências sancionadas', 'licença', 'aposentadoria/peças de prata'] },
  { group: 'Posses e kits', ref: 'p. 81–82', items: ['celular', 'cartão de dinheiro', 'kit clerical', 'kit de limpeza', 'kit delinquente', 'kit motorista', 'kit de campo', 'kit sucata', 'kit monitor', 'kit necrotério', 'kit porteiro', 'kit estudo', 'kit vigia'] },
  { group: 'Oculto/médico', ref: 'p. 83', items: ['Qlipoth', 'erva verde/vermelha', 'pílula adrenal', 'semente da árvore Ymir', 'medicina de sangue negro', 'corpo branco/negro', 'sal amaldiçoado', 'ambrosia'] }
]

export const sinMarks = [
  { name: 'Olhos', ref: 'p. 86', appearance: 'esclera alterada, íris branca, pupila duplicada ou fendida', options: ['Zoom até alcance extremo.', 'Ver através de paredes/matéria não viva em curto alcance.', 'Sentir estado emocional próximo; 1/caçada ganha +1D ao agir sobre isso.', 'Paralisar humano por contato visual breve.', 'Enxergar na escuridão e ignorar clima/obscurecimento visual.', '+1D em Vigilância, podendo chegar a 4D.'] },
  { name: 'Mandíbula', ref: 'p. 86', appearance: 'boca partida, presas, língua negra, saliva viscosa', options: ['Cuspir veneno negro como arma mundana de curto alcance.', 'Ganhar pecado para rerrolar ação que exija fala.', 'Sussurrar mensagem curta no ouvido de alvo em longo alcance.', '+1D para convencer/comandar humanos.', 'Uma vez por caçada, dar comando de uma palavra a humano.', '+1D em Autoridade, podendo chegar a 4D.'] },
  { name: 'Costas/Peito', ref: 'p. 87', appearance: 'espinhos, escamas, regeneração, lesões, asas vestigiais', options: ['Dado extra ao descansar, ganhando pecado igual ao resultado.', 'Não precisa respirar; imune a venenos/toxinas mundanas e álcool.', '+1 KP máximo.', 'Chance 1/6 de ignorar ferimento.', 'Apaga 1 estresse quando pressão aumenta.', '+1D em Condicionamento, podendo chegar a 4D.'] },
  { name: 'Braços/Mãos', ref: 'p. 87', appearance: 'garras, braço extra, dedos demais, músculos torcidos', options: ['Ganhar pecado para feito físico mundano até CAT 3.', 'Uma vez por caçada, esconder item/arma mundana no corpo.', 'Uma vez por caçada, dissolver matéria não viva de uma sala em lodo.', 'Ganhar pecado para transformar braço em arma sobrenatural 1/2 CAT por cena.', 'Rerrolar Força ou Interface ganhando pecado.', '+1D em Força, podendo chegar a 4D.'] },
  { name: 'Pele/Cabelo/Pernas', ref: 'p. 87', appearance: 'pele translúcida, descoloração, pernas digitígradas, cabelo alterado', options: ['Ganhar pecado para saltar altura de objeto CAT sem rolar.', 'Andar/escalar paredes com carne nua tocando.', '+1D ao correr em terreno aberto.', 'Ganhar pecado para planar curto alcance ao cair/saltar.', 'Ganhar pecado para ficar invisível à percepção mundana durante uma rolagem.', '+1D em Furtividade, podendo chegar a 4D.'] },
  { name: 'Escolha', ref: 'p. 86–87', appearance: 'resultado 6 permite escolher a localização e depois rolar habilidade', options: ['Se repetir uma marca existente, ela evolui e ganha nova habilidade; rerrole duplicatas.'] }
]

export const huntFlow = [
  { step: '1. Briefing', ref: 'p. 35', text: 'Apresente caso, área, tipo do Pecado, perguntas de trauma, incidente inicial e 2–3 pontos de interesse. Briefing não aumenta tensão.' },
  { step: '2. Chegada', ref: 'p. 36', text: 'Exorcistas chegam renovados: sem estresse, sem ferimentos, sem hooks, 3 bursts e KP cheio. Pecado, marcas, agendas, habilidades, XP e scrip continuam.' },
  { step: '3. Rastreamento', ref: 'p. 36', text: 'Objetivo central: achar palácio, host e rastros. Fora do palácio, o Pecado pode recuar e se curar; dentro, pode ser executado.' },
  { step: '4a. Investigação', ref: 'p. 37', text: 'Reúna pistas, vítimas, cena do crime, testemunhas, rituais e registros. Responder traumas dá counters poderosos na execução.' },
  { step: '4b. Preparação', ref: 'p. 37', text: 'Monte defesas, armadilhas, evacuação, talismãs, explosivos, rotas, veículos e vantagens contra domínios.' },
  { step: '4c. Descanso', ref: 'p. 38', text: 'Grupo decide descansar; pressão sobe 1. Cada exorcista rola 2d3 e aloca em recuperar bursts, apagar estresse ou limpar cortes de hook.' },
  { step: '5a. Tensão', ref: 'p. 39, 105', text: 'Talismã visível de 3 cortes. Aumenta quando cena passa ou sai 1 no risco (1 vez/cena). Ao encher, limpa, pressão +1 e ativa movimento de tensão.' },
  { step: '5b. Pressão', ref: 'p. 39, 106', text: 'Talismã de 6. Representa degradação única do Pecado. Cada ponto soma ao talismã de execução. Se passa de 6, sai de controle e o Pecado ganha +1 CAT.' },
  { step: '6. Execução', ref: 'p. 40–41, 107–108', text: 'Conflito final no palácio. Talismã de execução do Pecado é 8 + pressão + CAT. Ao preencher dentro do palácio, exorcistas escolhem executar, falhar ou poupar se houver trauma revelado.' },
  { step: '7. Exfiltração', ref: 'p. 41', text: 'Sucesso: 5 scrip. Poupar: 3 scrip. Falha: -1 scrip. Recuperar restos de exorcista: +1 XP e +1 scrip. Todos reduzem pecado pela metade e marcam sobrevivência.' }
]

export const conflictRules = [
  { title: 'Quando usar conflito', ref: 'p. 42', body: 'Use quando há lados opostos e apostas altas: combate, perseguição, infiltração, julgamento, duelo social. Toda ação começa arriscada.' },
  { title: 'Estrutura', ref: 'p. 42–43', body: 'Defina apostas, cena e talismãs. Exorcistas agem primeiro em qualquer ordem. Ao fim de todos, uma rodada passa.' },
  { title: 'Ações em conflito', ref: 'p. 43', body: 'Act progride objetivo/talismã. Defend reduz dano de aliado. Setup/Teamwork funcionam como no básico. Analyze revela informação ou cria abertura duradoura. Flee remove personagem da cena.' },
  { title: 'Reação do Admin', ref: 'p. 43, 107–108', body: 'NPCs não têm turno separado; reagem com dado de risco quando uma ação arriscada provoca reação. Use ataque, complicação, ameaça ou ataque severo.' }
]

export const tensionMoves = ['Enviar minions/traços', 'Emboscar exorcistas', 'Envolver autoridades', 'Separar alguém', 'Forçar escolha difícil', 'Escalar a situação', 'Afetar com aflição/hook', 'Criar ou avançar relógio/talismã', 'Usar domínio do Pecado', 'Ameaçar/distorcer NPC', 'Introduzir novo obstáculo']

export const adminPrinciples = [
  { title: 'Segurança primeiro', ref: 'p. 89', body: 'CAIN é horror violento e psicológico. Combine limites, ferramentas de segurança, tom, temas proibidos e portas abertas para pausar/retomar.' },
  { title: 'Ficção antes do número', ref: 'p. 11–19, 89–93', body: 'Ferramentas, posição, luz, ruído, medo, preparação e CAT mudam risco, dificuldade e necessidade de rolagem.' },
  { title: 'Investigações não devem travar', ref: 'p. 94–95', body: 'Dê pistas suficientes. Use rolagens para custo, detalhe, velocidade ou perigo — não para bloquear todo progresso.' },
  { title: 'Pecados são tragédias armadas', ref: 'p. 101–109', body: 'Toda ameaça nasce de uma ferida humana. Quanto mais os jogadores entendem a ferida, mais forte é o final.' },
  { title: 'Use talismãs visíveis', ref: 'p. 17, 93', body: 'Tensão, pressão, execução, preparo, veneno, perseguição e evacuação ficam melhores quando o grupo vê o relógio avançar.' },
  { title: 'CAIN mente e cobre rastros', ref: 'p. 98–99', body: 'A organização é global, clandestina e poderosa. Use conflito com autoridades, cobertura, doutrina interna e moralidade duvidosa.' }
]

export const investigationSteps = [
  'Escolha tipo, forma e CAT do Pecado.',
  'Defina host, incidente inicial e situação atual.',
  'Responda três perguntas de trauma e espalhe pistas tangíveis.',
  'Crie palácio: localização, entrada, aparência, regra estranha e por que reflete o host.',
  'Escolha três domínios e como eles aparecem nas cenas.',
  'Liste pontos de interesse: pessoas, locais, objetos, vítimas e autoridades.',
  'Crie tensão e pressão: o que acontece quando a situação piora?',
  'Prepare 2–3 conflitos possíveis, mas aceite soluções improvisadas.'
]

export const sinCore = [
  { title: 'Tipo', ref: 'p. 102', body: 'Define tom, emoção primária, traumas e comportamento. Tipos básicos: Ogre, Idol, Hound, Centipede, Toad e Lord.' },
  { title: 'Forma', ref: 'p. 103', body: 'I/Severed: separado do host. II/Fused: unido ao corpo/cadáver do host. III/Bound: controlado por humano/exorcista. Forma é principalmente temática.' },
  { title: 'Categoria', ref: 'p. 103', body: 'Pecados CAT 0–7. CAT 1–2 já mata humanos facilmente. CAT maior torna ações contra ele Difíceis, arriscadas ou impossíveis.' },
  { title: 'Domínios', ref: 'p. 104', body: 'Cada Pecado tem três domínios, suas grandes forças sobrenaturais. Eles orientam ataques, complicações, tensão e tom.' },
  { title: 'Palácio', ref: 'p. 104', body: 'Lair/pocket dimension. Fora dele, o Pecado pode recuar ao sofrer 4 cortes; dentro, não foge e pode ser executado.' },
  { title: 'Traumas', ref: 'p. 106', body: 'Três perguntas sobre a origem. Cada resposta descoberta pode ser usada uma vez na execução para reduzir estresse e cortar o talismã do Pecado.' },
  { title: 'Talismã de Execução', ref: 'p. 107', body: 'Use 8 + pressão + CAT. Ataques diretos cortam. Preencher dentro do palácio deixa o Pecado à mercê dos exorcistas.' },
  { title: 'Reações', ref: 'p. 107–108', body: 'Com o dado de risco: ataque, complicação, ameaça, ataque severo ou reação improvisada. A reação nunca deve apagar um sucesso, mas pode cobrar custo.' }
]

export const sinTypes = [
  { name: 'Ogre', pt: 'Ogro', ref: 'p. 110–115', emotion: 'Desespero', summary: 'Massa sufocante de tristeza e colapso. Costuma tomar área com miasma, peso e escuridão; seu drama gira em torno de alguém esmagado pela própria situação.', play: ['Use atmosfera opressiva, falta de ar, isolamento e vítimas desaparecidas.', 'Pressão deve fazer a área ficar cada vez mais inabitável.', 'Bom para caçadas claustrofóbicas e melancólicas.'] },
  { name: 'Idol', pt: 'Ídolo', ref: 'p. 116–121', emotion: 'Desejo/adoração', summary: 'Pecado carismático que manipula pessoas, cria culto e puxa cordas por trás da cena.', play: ['Use seguidores, mentiras, festas, grupos sociais e paranoia.', 'O perigo está em quem acredita no Ídolo tanto quanto no próprio monstro.', 'Bom para investigação social e conspiração.'] },
  { name: 'Hound', pt: 'Cão de Caça', ref: 'p. 122–127', emotion: 'Raiva', summary: 'Manifestação de fúria e vingança, frequentemente pós-morte, que persegue culpados ou um grupo inteiro.', play: ['Use perseguição, cenas de ataque rápido e lista de alvos.', 'Traumas devem revelar quem merece ou não a vingança.', 'Bom para ação brutal e dilemas sobre justiça.'] },
  { name: 'Centipede', pt: 'Centopeia', ref: 'p. 128–133', emotion: 'Ódio', summary: 'Catástrofe viva, nascida do desejo de escapar por destruição total. Infecta, envenena e ameaça mortes em massa.', play: ['Use contágio, evacuação, relógios de vítimas e ambientes apodrecendo.', 'Pressão deve parecer desastre público inevitável.', 'Bom para horror corporal e missão de contenção.'] },
  { name: 'Toad', pt: 'Sapo', ref: 'p. 134–139', emotion: 'Indulgência/ganância', summary: 'Pecado inteligente, avarento e sarcástico, ligado à privação material e acúmulo impossível.', play: ['Use roubo, dívidas, exploração, barganhas e esconderijos cheios de bens.', 'Ele gosta de falar, negociar e humilhar.', 'Bom para heist sobrenatural e antagonista astuto.'] },
  { name: 'Lord', pt: 'Lorde', ref: 'p. 140–145', emotion: 'Medo/perda', summary: 'Cria reino/palácio nostálgico para congelar uma vida antes da tragédia; moralista, guardião e tirano.', play: ['Use regras de reino, leis impossíveis, memórias idealizadas e pessoas presas.', 'Traumas devem mostrar o que foi perdido e por que o host não aceita mudança.', 'Bom para drama, palácio elaborado e final moralmente difícil.'] }
]

export const opponentRules = [
  { title: 'Criar oponente', ref: 'p. 146', body: 'Anote nome, tipo, CAT, talismã de execução curto/médio/longo, fatos importantes, dano típico e complicações/ameaças.' },
  { title: 'Humanos mundanos', ref: 'p. 146–151', body: 'Policiais, seguranças, cultistas, mercenários e civis perigosos costumam ter CAT 0, talismãs curtos/médios e dano 1–2.' },
  { title: 'Traces', ref: 'p. 108–109', body: 'Ecos menores de Pecados. Reagem como Sins, mas são mais fracos. Ao lado do Pecado, o Admin ainda escolhe apenas uma reação por vez, salvo exceções.' },
  { title: 'Binders', ref: 'p. 152–153', body: 'Exorcistas renegados ou autônomos, CAT 0–6, com blasfêmias selvagens. Podem usar poderes parecidos com exorcistas, criar ameaças, curar talismã, fazer psy clash e até fundir com Sin/aliado.' }
]

export const binderThemes = ['Tension: lâminas, prisões e campos', 'Ardence: fogo, frio e destruição', 'Flux: cura, atraso e tempo', 'Vector: voo, arremesso e velocidade', 'Gate: teleporte e espaço', 'Smother: invisibilidade, silêncio, ausência', 'Whisper: planos revelados e presságio', 'Edit: disfarce, alteração de corpo/equipamento', 'Bind: Sins vinculados e fusão', 'Jaunt: possessão e marionetes', 'Palace: puxar para dentro/fora do palácio', 'Sympathy: maestria sobrenatural com objetos']
