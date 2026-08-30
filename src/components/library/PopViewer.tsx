import React, { useState, useMemo } from 'react';
import {
  FileText,
  Search,
  Printer,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  Flame,
  Droplets,
  Sparkles,
  CheckCircle2,
  BookOpen,
  Scale,
  Thermometer,
  Layers,
  Clock,
  Eye,
  Beaker,
  FileSpreadsheet,
  Award,
  Check,
  Copy,
  ExternalLink,
  ChevronDown,
  Info,
  Maximize2,
  FileCheck,
  HeartHandshake,
  FlaskConical,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CalculadoraDosagemPesagemAstraya } from '../calculators/CalculadoraDosagemPesagemAstraya';

// Tipagem das seções do Manual POP Astraya
interface PopSection {
  id: string;
  number: string;
  title: string;
  category: 'GERAL' | 'SEGURANCA' | 'EXTRACAO' | 'FORMULACAO' | 'METROLOGIA' | 'QUALIDADE';
  summary: string;
}

export const PopViewer: React.FC = () => {
  const { setNotificationMessage } = useApp();

  const [activeSectionId, setActiveSectionId] = useState<string>('sec-09-extracao');
  const [searchTerm, setSearchTerm] = useState('');
  const [isCalculadoraOpen, setIsCalculadoraOpen] = useState(false);
  const [mobileView, setMobileView] = useState<'INDEX' | 'READER'>('READER');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Lista completa de seções correspondentes às 34 páginas do documento oficial
  const sections: PopSection[] = [
    { id: 'sec-01-capa', number: '01', title: 'Capa, Identificação Oficial & Sumário', category: 'GERAL', summary: 'Dados de registro TJSP, responsabilidade técnica CRQ-IV e estrutura do manual.' },
    { id: 'sec-02-conduta', number: '02', title: 'Código de Conduta & Direitos (MBPL-0001)', category: 'GERAL', summary: 'Diretrizes de capacitação, integridade de dados e deveres dos colaboradores.' },
    { id: 'sec-03-objetivo', number: '03', title: 'Objetivo, Aplicação (Ibiúna-SP) & Glossário', category: 'GERAL', summary: 'Definições regulatórias: Calibração, Amostragem, RNC, SGQ e Farmacopeia.' },
    { id: 'sec-04-responsabilidades', number: '04', title: 'Matriz de Responsabilidades & Diretoria', category: 'QUALIDADE', summary: 'Atribuições da diretoria, responsabilidade técnica e conduta de visitantes.' },
    { id: 'sec-05-higiene', number: '05', title: 'Organização Pessoal, 5S & Higienização', category: 'SEGURANCA', summary: 'Metodologia 5S e procedimento padrão de lavagem das mãos em 11 etapas (40-60s).' },
    { id: 'sec-06-infraestrutura', number: '06', title: 'Infraestrutura Laboratorial & Áreas', category: 'GERAL', summary: 'Divisão de áreas: Cultivo, Extração/Dispensação e Área de Descarte.' },
    { id: 'sec-07-seguranca', number: '07', title: 'Segurança, EPIs (NR-06) & Lava-Olhos', category: 'SEGURANCA', summary: 'Jalecos sem bolsos, luvas nitrílicas/criogênicas, protetores faciais e lava-olhos.' },
    { id: 'sec-08-incendio', number: '08', title: 'Proteção Contra Incêndios (NR-23) & Classes', category: 'SEGURANCA', summary: 'Guia de extintores (Água, CO2, Pó Químico, Espuma) e classes de fogo A, B, C, D e K.' },
    { id: 'sec-09-extracao', number: '09', title: 'Processo de Extração de Fitocanabinoides', category: 'EXTRACAO', summary: 'Farmacopeia 7ª Ed., Espectrofotometria T-Check 3 e isolamento de tricomas.' },
    { id: 'sec-10-gelo-seco', number: '10', title: 'POP Extração Etanol a Frio & Gelo Seco (-60°C)', category: 'EXTRACAO', summary: 'Panela inox 13L, 8L álcool 96%, bags 25-45u e winterização de 12-18h.' },
    { id: 'sec-11-rosin', number: '11', title: 'POP Extração Rosin (Calor & Prensa 4t)', category: 'EXTRACAO', summary: 'Prensagem mecânica a 4 toneladas, bags 120u e sanitização em agitador magnético.' },
    { id: 'sec-12-armazenamento', number: '12', title: 'Armazenamento, Descarboxilação (95°C) & TCM', category: 'EXTRACAO', summary: 'Estabilidade em 5-10°C, proteção UV e indução térmica a 95°C por 35 min.' },
    { id: 'sec-13-oleos-orais', number: '13', title: 'Formulações Orais (CBD Ygriega & THC Melon)', category: 'FORMULACAO', summary: 'Tabelas de diluição: 700mg, 1500mg, 3000mg e preparo de 1 frasco de 30mL.' },
    { id: 'sec-14-dermatologicos', number: '14', title: 'Formulações Dermatológicas (Óleo, Creme & Pomada)', category: 'FORMULACAO', summary: 'Óleo de massagem (Cód. 13), Creme CBDA/Macela (Cód. 17) e Pomada Karité (Cód. 18).' },
    { id: 'sec-15-prescritores', number: '15', title: 'Tabela de Dosagens para Prescritores Médicos', category: 'FORMULACAO', summary: 'Concentrações em 1mL, 0.75mL, 0.5mL, 0.25mL e 0.1mL para Óleos e Tinturas.' },
    { id: 'sec-16-equipamentos', number: '16', title: 'Equipamentos, Calibração & Metrologia', category: 'METROLOGIA', summary: 'Calibração rastreável INMETRO/RBC, balanças analíticas e laudos arquivados.' },
    { id: 'sec-17-gestao-residuos', number: '17', title: 'Controle de Registros, RNC, Químicos & Resíduos', category: 'QUALIDADE', summary: 'Relatórios de Não Conformidade (RNC), armários corta-fogo e descarte ambiental.' },
    { id: 'sec-18-referencias', number: '18', title: 'Referências Técnicas & Bibliografia Oficial', category: 'QUALIDADE', summary: 'RDC 512/2021, ISO 17025, NBR 14725, Booth et al. e Carvalho et al.' },
  ];

  const filteredSections = useMemo(() => {
    return sections.filter((s) => {
      return (
        !searchTerm ||
        s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.number.includes(searchTerm)
      );
    });
  }, [searchTerm]);

  const handleCopyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setNotificationMessage(`Copiado para área de transferência: ${label}`);
    setTimeout(() => {
      setCopiedText(null);
      setNotificationMessage(null);
    }, 2500);
  };

  return (
    <div className="space-y-4">
      {/* Top Banner de Identificação Oficial do Laboratório */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300">
                MBPL-0001 Rev. 1.0
              </span>
              <h1 className="text-xl font-serif italic text-slate-800 font-normal">
                POP - Procedimento Operacional Padrão
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                Manual de Boas Práticas Laboratoriais
              </span>
            </div>
            <p className="text-xs text-slate-600 font-mono mt-1">
              Associação Astraya • Sede Ibiúna/SP • Responsável Técnico: Igor Lopes
            </p>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setIsCalculadoraOpen(!isCalculadoraOpen)}
              className={`px-2.5 py-1 rounded border text-[11px] font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                isCalculadoraOpen
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Calculadora de Dosagem & Pesagem</span>
            </button>

            <button
              onClick={() => window.print()}
              className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-medium rounded flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              title="Imprimir documento em formato oficial de laudo"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir / PDF</span>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-3 pt-3 border-t border-slate-100">
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar no manual POP por título, termo ou palavra-chave..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-md pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none"
            />
          </div>
        </div>

        {/* Mobile View Toggle Buttons (Hidden on LG screens) */}
        <div className="flex lg:hidden items-center mt-3 pt-2 border-t border-slate-100 gap-2">
          <button
            onClick={() => setMobileView('INDEX')}
            className={`flex-1 py-1.5 px-3 rounded-md text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              mobileView === 'INDEX'
                ? 'bg-emerald-700 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Sumário ({filteredSections.length})</span>
          </button>
          <button
            onClick={() => setMobileView('READER')}
            className={`flex-1 py-1.5 px-3 rounded-md text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              mobileView === 'READER'
                ? 'bg-emerald-700 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Ver Seção Aberta</span>
          </button>
        </div>
      </div>

      {/* Pop Formula Quick Calculator Modal / Drawer */}
      {isCalculadoraOpen && (
        <CalculadoraDosagemPesagemAstraya
          isClosable
          onClose={() => setIsCalculadoraOpen(false)}
        />
      )}

      {/* Main Container: Index Sidebar + Document Reader */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left Interactive Index */}
        <div className={`${mobileView === 'INDEX' ? 'block' : 'hidden'} lg:block lg:col-span-4 bg-white border border-slate-200 rounded-lg p-3 shadow-xs space-y-2`}>
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
              <span>Sumário do Manual</span>
            </span>
            <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              {filteredSections.length} itens
            </span>
          </div>

          <div className="space-y-1 max-h-[620px] overflow-y-auto pr-1">
            {filteredSections.map((sec) => {
              const isSelected = activeSectionId === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => {
                    setActiveSectionId(sec.id);
                    setMobileView('READER');
                  }}
                  className={`w-full text-left p-2.5 rounded-lg border transition-all cursor-pointer flex items-start justify-between gap-2 ${
                    isSelected
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-950 shadow-2xs'
                      : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                          isSelected
                            ? 'bg-emerald-200 text-emerald-900'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        Sec. {sec.number}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {sec.category}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 mt-1 leading-snug">
                      {sec.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                      {sec.summary}
                    </p>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 shrink-0 mt-2 ${
                      isSelected ? 'text-emerald-700' : 'text-slate-300'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Legal Badge Box */}
          <div className="bg-slate-50 p-2.5 rounded border border-slate-200 text-[10.5px] text-slate-600 space-y-1">
            <div className="flex items-center gap-1 font-bold text-slate-700 uppercase">
              <Award className="w-3 h-3 text-emerald-600" />
              <span>Validação Documental</span>
            </div>
            <p className="leading-tight">
              Aprovado pela Diretoria Astraya e Responsabilidade Técnica. Arquivado sob o processo eletrônico TJSP nº 1009141-46.2024.8.26.0176.
            </p>
          </div>
        </div>

        {/* Right Dynamic Section Content View */}
        <div className={`${mobileView === 'READER' ? 'block' : 'hidden'} lg:block lg:col-span-8 bg-white border border-slate-200 rounded-lg p-3 sm:p-5 shadow-xs space-y-5 text-slate-900 min-h-[500px]`}>
          {/* Header of Active Section */}
          <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                  ASTRAYA • MBPL-0001 Rev. 1.0
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  Sede: Ibiúna - SP • Lab. Fitoquímico
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 mt-1.5">
                {sections.find((s) => s.id === activeSectionId)?.title}
              </h2>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() =>
                  handleCopyText(
                    `Associação Astraya - Procedimento Operacional Padrão e Manual de Boas Práticas Laboratoriais (MBPL-0001 Rev. 1.0). Elaborador: Cristina Sousa (CRQ-IV 04164066). Ibiúna - SP, 2024.`,
                    'Citação do Documento'
                  )
                }
                className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                title="Copiar referência do documento"
              >
                {copiedText ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>Copiar Ref.</span>
              </button>
            </div>
          </div>

          {/* SECTION CONTENTS ACCORDING TO PDF DOCUMENT */}

          {/* SEC 01 & 02: CAPA E CÓDIGO DE CONDUTA */}
          {(activeSectionId === 'sec-01-capa' || activeSectionId === 'sec-02-conduta') && (
            <div className="space-y-4 text-xs text-slate-800 leading-relaxed">
              <div className="bg-emerald-50/50 p-4 rounded-lg border border-emerald-200">
                <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm mb-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>Documento Oficial de Boas Práticas de Laboratório (MBPL-0001 Rev. 1.0)</span>
                </div>
                <p className="text-slate-700">
                  Manual institucional elaborado para estabelecer as diretrizes de execução das atividades nas dependências e laboratórios da <strong>Associação Astraya</strong> em Ibiúna - SP, garantindo padronização, eficiência, segurança ocupacional e confiabilidade metrológica nas análises e processos produtivos.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                    Elaboração & Responsabilidade Técnica:
                  </span>
                  <p className="font-bold text-slate-900">Cristina Sousa</p>
                  <p className="text-slate-600 font-mono text-[11px]">CRQ-IV Região - Registro nº 04164066</p>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                    Aprovação Diretoria Executiva:
                  </span>
                  <p className="font-bold text-slate-900">Odilon Castro & Carlos Eduardo P. Bertazzi</p>
                  <p className="text-slate-600 font-mono text-[11px]">Protocolo TJSP nº 1009141-46.2024.8.26.0176 (Cód: 8kjJQBNf, fls. 88)</p>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                  Código de Conduta, Direitos e Deveres dos Colaboradores
                </h4>
                <ul className="space-y-1.5 list-disc pl-4 text-slate-700">
                  <li><strong>Condições Adequadas:</strong> Garantia de infraestrutura, procedimentos validados e instruções de trabalho atualizadas.</li>
                  <li><strong>Capacitação Contínua:</strong> Treinamento periódico nas Boas Práticas Laboratoriais e regras estatutárias.</li>
                  <li><strong>Integridade dos Dados:</strong> Registro fidedigno e rastreabilidade absoluta de todas as análises químicas, físicas e microbiológicas.</li>
                  <li><strong>Dever de Reporte:</strong> Obrigação de notificar prontamente qualquer desvio de qualidade através de RNC (Registro de Não Conformidade).</li>
                </ul>
              </div>
            </div>
          )}

          {/* SEC 03 & 04: OBJETIVO, APLICAÇÃO & GLOSSÁRIO */}
          {(activeSectionId === 'sec-03-objetivo' || activeSectionId === 'sec-04-responsabilidades') && (
            <div className="space-y-4 text-xs text-slate-800 leading-relaxed">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-emerald-800 block mb-1">
                    1. Objetivo Principal
                  </span>
                  <p className="text-slate-700">
                    Estabelecer as diretrizes operacionais para execução de todas as atividades laboratoriais na Associação Astraya, buscando padronização, eficiência e segurança no manuseio de fitoterápicos.
                  </p>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-emerald-800 block mb-1">
                    2. Campo de Aplicação
                  </span>
                  <p className="text-slate-700">
                    Aplicável a todos os laboratórios, áreas de cultivo, extração, armazenamento, dispensação, embalagem e escritório na sede da <strong>Associação Astraya em Ibiúna - SP</strong>.
                  </p>
                </div>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block mb-2">
                  Glossário de Termos e Definições Regulatórias:
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
                  {[
                    { termo: 'Ação Corretiva', desc: 'Ação realizada para corrigir uma não conformidade existente, eliminando a causa raiz.' },
                    { termo: 'Ação Preventiva', desc: 'Ação para eliminar um risco potencial antes que o problema ocorra.' },
                    { termo: 'Amostragem', desc: 'Coleta de amostras representativas definidas estatisticamente pelo tamanho do lote.' },
                    { termo: 'Calibração', desc: 'Relação documentada entre valores indicados por um instrumento e padrões de referência.' },
                    { termo: 'FISPQ / FDS', desc: 'Ficha com Dados de Segurança de Produtos Químicos de acesso obrigatório aos colaboradores.' },
                    { termo: 'Garantia da Qualidade', desc: 'Gestão focada em demonstrar que todos os requisitos técnicos foram cumpridos.' },
                    { termo: 'Método Analítico', desc: 'Descrição dos procedimentos analíticos e ensaios físico-químicos das matrizes.' },
                    { termo: 'RNC (Relatório Não Conformidade)', desc: 'Registro formal de desvios, ações corretivas, preventivas e notificação à Diretoria.' },
                    { termo: 'Substância de Referência', desc: 'Material de referência com características uniformes para calibração e ensaios.' },
                    { termo: 'Validação Metrológica', desc: 'Ato documentado que atesta que processos e equipamentos fornecem resultados consistentes.' },
                  ].map((item, idx) => (
                    <div key={idx} className="bg-slate-50 p-2.5 rounded border border-slate-200">
                      <span className="font-bold text-slate-900">{item.termo}: </span>
                      <span className="text-slate-600">{item.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SEC 05: HIGIENE PESSOAL & GUIA 5S */}
          {activeSectionId === 'sec-05-higiene' && (
            <div className="space-y-4 text-xs text-slate-800 leading-relaxed">
              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                <h4 className="font-bold text-slate-900 text-xs uppercase mb-1">
                  Organização Pessoal e Metodologia 5S
                </h4>
                <p className="text-slate-700">
                  A organização das bancadas e áreas produtivas obedece rigorosamente aos 5 sensos da metodologia 5S (Utilização, Organização, Limpeza, Padronização e Disciplina). Objetos desnecessários devem ser removidos das bancadas para evitar contaminação cruzada e atos inseguros.
                </p>
              </div>

              {/* Procedimento Ilustrado de Lavagem das Mãos (40-60 segundos) */}
              <div className="border border-emerald-200 bg-emerald-50/40 p-4 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-emerald-700" />
                    <h4 className="font-bold text-emerald-950 text-xs uppercase">
                      Procedimento Padrão de Higienização das Mãos (Duração: 40 a 60 segundos)
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                    Obrigatório na entrada/saída do laboratório
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-[11px]">
                  {[
                    { p: '0', t: 'Umedecer', d: 'Molhar as mãos com água corrente limpa.' },
                    { p: '1', t: 'Sabão', d: 'Aplicar sabão líquido suficiente para cobrir toda a superfície.' },
                    { p: '2', t: 'Palmas', d: 'Friccionar as palmas das mãos entre si com firmeza.' },
                    { p: '3', t: 'Dorso e Dedos', d: 'Friccionar a palma direita sobre o dorso da esquerda entrelaçando os dedos e vice-versa.' },
                    { p: '4', t: 'Entrelaçado', d: 'Friccionar palma contra palma com dedos entrelaçados.' },
                    { p: '5', t: 'Dorso dos Dedos', d: 'Friccionar o dorso dos dedos na palma oposta segurando os dedos.' },
                    { p: '6', t: 'Polegares', d: 'Friccionar o polegar com movimento circular na palma da outra mão.' },
                    { p: '7', t: 'Pontas e Unhas', d: 'Friccionar as pontas dos dedos e unhas em círculos na palma oposta.' },
                    { p: '8', t: 'Enxaguar', d: 'Enxaguar abundantemente com água corrente eliminando o sabão.' },
                    { p: '9', t: 'Secar', d: 'Secar as mãos com papel toalha descartável de uso único.' },
                    { p: '10', t: 'Torneira', d: 'Utilizar o mesmo papel toalha para fechar a torneira.' },
                    { p: '11', t: 'Mãos Seguras', d: 'Mãos higienizadas e prontas para colocação de luvas e EPIs.' },
                  ].map((step) => (
                    <div key={step.p} className="bg-white p-2 rounded border border-slate-200 shadow-2xs">
                      <div className="flex items-center gap-1 mb-1">
                        <span className="w-4 h-4 rounded-full bg-emerald-600 text-white font-mono text-[9px] font-bold flex items-center justify-center">
                          {step.p}
                        </span>
                        <span className="font-bold text-slate-800 text-[10.5px]">{step.t}</span>
                      </div>
                      <p className="text-slate-600 text-[10px] leading-tight">{step.d}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SEC 06: INFRAESTRUTURA */}
          {activeSectionId === 'sec-06-infraestrutura' && (
            <div className="space-y-4 text-xs text-slate-800 leading-relaxed">
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                  Divisão Física e Requisitos Estruturais
                </h4>
                <p className="text-slate-700">
                  As instalações da Associação Astraya são estruturadas em divisões independentes para evitar qualquer risco de contaminação cruzada:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
                  <div className="bg-white p-3 rounded border border-slate-200">
                    <span className="font-bold text-emerald-800 block text-xs mb-1">1. Lab. de Cultivo</span>
                    <p className="text-[11px] text-slate-600">Ambiente climatizado, controle fitossanitário orgânico e secagem controlada a 18°C / 55-60% UR.</p>
                  </div>
                  <div className="bg-white p-3 rounded border border-slate-200">
                    <span className="font-bold text-blue-800 block text-xs mb-1">2. Lab. Extração & Dispensação</span>
                    <p className="text-[11px] text-slate-600">Área limpa, capela com exaustão, manipuladores com paramentação integral e fluxo de ar.</p>
                  </div>
                  <div className="bg-white p-3 rounded border border-slate-200">
                    <span className="font-bold text-amber-800 block text-xs mb-1">3. Área de Descarte</span>
                    <p className="text-[11px] text-slate-600">Local segregado para resíduos perigosos e biológicos conforme Plano de Gerenciamento.</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
                <div className="bg-slate-50 p-3 rounded border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-900 uppercase text-[10px]">Revestimentos & Pisos:</span>
                  <p className="text-slate-700">Paredes e pisos de materiais neutros, não porosos, de cor clara e fácil higienização, com o mínimo de rejunte possível para impedir acúmulo de partículas nas reentrâncias.</p>
                </div>
                <div className="bg-slate-50 p-3 rounded border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-900 uppercase text-[10px]">Vestiários & Convivência:</span>
                  <p className="text-slate-700">Totalmente separados das áreas produtivas e de análise. Proibido transitar com EPIs (jalecos, propés) fora das salas limpas.</p>
                </div>
              </div>
            </div>
          )}

          {/* SEC 07 & 08: SEGURANÇA, EPIS & INCÊNDIOS */}
          {(activeSectionId === 'sec-07-seguranca' || activeSectionId === 'sec-08-incendio') && (
            <div className="space-y-4 text-xs text-slate-800 leading-relaxed">
              {/* Regras Básicas */}
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Regras Fundamentais de Segurança Laboratorial (NR-06 e NR-23)</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
                  <div className="space-y-1 text-slate-700">
                    <p>• Proibido comer, beber ou fumar dentro dos laboratórios.</p>
                    <p>• FISPQs físicas e eletrônicas disponíveis junto aos reagentes.</p>
                    <p>• Avental de manga longa sem bolsos e sem tecido inflamável.</p>
                    <p>• Cabelos presos, calçado fechado e proibição de adornos/joias.</p>
                  </div>
                  <div className="space-y-1 text-slate-700">
                    <p>• Proibido pipetar com a boca (uso estrito de peras de sucção).</p>
                    <p>• Uso obrigatório de óculos de segurança e luvas nitrílicas.</p>
                    <p>• Lava-olhos de emergência permanentemente desobstruído.</p>
                    <p>• Visitantes com touca, propé e autorização da RT.</p>
                  </div>
                </div>
              </div>

              {/* Tabela de Classes de Fogo & Extintores */}
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <div className="bg-slate-100 p-2.5 font-bold text-slate-800 text-xs uppercase flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-rose-600" />
                  <span>Classificação de Incêndios e Extintores Aplicáveis (NR-23)</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[11px] text-slate-700">
                    <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase border-b border-slate-200">
                      <tr>
                        <th className="p-2.5">Classe</th>
                        <th className="p-2.5">Materiais Combustíveis</th>
                        <th className="p-2.5">Agente Extintor Recomendado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="p-2.5 font-bold text-slate-900">Classe A</td>
                        <td className="p-2.5">Sólidos: papel, madeira, tecidos, algodão</td>
                        <td className="p-2.5 font-semibold text-emerald-800">Água pressurizada / Espuma mecânica</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold text-slate-900">Classe B</td>
                        <td className="p-2.5">Líquidos inflamáveis, solventes, álcool 96%, ceras</td>
                        <td className="p-2.5 font-semibold text-rose-800">Dióxido de Carbono (CO2) / Pó Químico Seco</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold text-slate-900">Classe C</td>
                        <td className="p-2.5">Equipamentos elétricos energizados, agitadores, prensas</td>
                        <td className="p-2.5 font-semibold text-blue-800">CO2 / Pó Químico (Nunca usar água!)</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold text-slate-900">Classe D</td>
                        <td className="p-2.5">Metais pirofóricos (lítio, magnésio, zircônio)</td>
                        <td className="p-2.5 text-amber-800">Pó químico especial Classe D</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold text-slate-900">Classe K</td>
                        <td className="p-2.5">Óleos vegetais, gorduras e fritadeiras</td>
                        <td className="p-2.5 text-purple-800">Solução de acetato de potássio (Classe K)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* SEC 09 & 10: POP EXTRAÇÃO ETANOL A FRIO & GELO SECO */}
          {(activeSectionId === 'sec-09-extracao' || activeSectionId === 'sec-10-gelo-seco') && (
            <div className="space-y-4 text-xs text-slate-800 leading-relaxed">
              <div className="bg-blue-50/60 p-3.5 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 text-blue-950 font-bold text-xs uppercase mb-1">
                  <Thermometer className="w-4 h-4 text-blue-700" />
                  <span>Método 1: Extração Criogênica por Etanol a -60°C com Gelo Seco</span>
                </div>
                <p className="text-slate-700">
                  Baseado no <em>Método Accura</em> (Ian Guedes & Felipe de Castro) e estudos de Virginia Carvalho (2023). A baixíssima temperatura congela a água intracelular, impedindo o rompimento dos cloroplastos e minimizando ceras, preservando mais de 90% dos monoterpenos e canabinoides.
                </p>
              </div>

              {/* Lista de Materiais da Extração */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-700 block mb-1.5">
                  Materiais e Equipamentos Obrigatórios:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] text-slate-700">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                    <span>Panela de Inox grau alimentício 13 Litros</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                    <span>8 Litros de Álcool de Cereais 96% Extra Neutro</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                    <span>Gelo Seco (Dióxido de Carbono sólido) em pellets</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                    <span>Bags filtradoras de 25 micras e 45 micras</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                    <span>Balança de precisão (0,01g) e Luvas térmicas</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                    <span>Agitador magnético com evaporação e termômetro infravermelho</span>
                  </div>
                </div>
              </div>

              {/* Passo a Passo Oficial da Extração a Frio */}
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-700 block">
                  Procedimento Operacional Passo a Passo (Manual Astraya, pág. 18):
                </span>

                {[
                  {
                    step: 1,
                    title: 'Pesagem & Acondicionamento da Biomassa',
                    desc: 'Com luvas descartáveis, pesar a biomassa seca curada e acondicionar na bag filtradora com micragem entre 25u e 45u.',
                  },
                  {
                    step: 2,
                    title: 'Resfriamento do Solvente a -60°C',
                    desc: 'Em panela de inox de 13L, adicionar 8 litros de álcool de cereais 96%. Adicionar gelo seco em pequenas doses controladas até atingir -60°C.',
                  },
                  {
                    step: 3,
                    title: 'Imersão da Bag com Biomassa',
                    desc: 'Inserir a bag até afundar completamente no álcool resfriado e cobrir com uma generosa camada de gelo seco por cima.',
                  },
                  {
                    step: 4,
                    title: 'Winterização & Maceração Criogênica (12 a 18 Horas)',
                    desc: 'Manter a bag imersa por 12 a 18 horas contínuas, monitorando a temperatura para manter-se estritamente em torno de -60°C.',
                  },
                  {
                    step: 5,
                    title: 'Filtração Fina com Bag de 25 micras',
                    desc: 'Remover a bag e realizar a filtragem final com tela de 25 micras para separar qualquer partícula sólida restante.',
                  },
                  {
                    step: 6,
                    title: 'Evaporação Completa do Solvente',
                    desc: 'Evaporar o gelo seco e recuperar o solvente alcoólico em temperatura branda, resultando em resina pura rica em canabinoides.',
                  },
                ].map((item) => (
                  <div key={item.step} className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex gap-2.5 items-start">
                    <div className="w-5 h-5 rounded bg-emerald-700 text-white font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs">{item.title}</h4>
                      <p className="text-slate-600 text-[11px] mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SEC 11: POP EXTRAÇÃO ROSIN POR PRESSÃO & CALOR */}
          {activeSectionId === 'sec-11-rosin' && (
            <div className="space-y-4 text-xs text-slate-800 leading-relaxed">
              <div className="bg-amber-50/60 p-3.5 rounded-lg border border-amber-200">
                <div className="flex items-center gap-2 text-amber-950 font-bold text-xs uppercase mb-1">
                  <Flame className="w-4 h-4 text-amber-700" />
                  <span>Método 2: Extração Rosin por Calor e Pressão Mecânica</span>
                </div>
                <p className="text-slate-700">
                  Método 100% físico (sem solvente químico). A pressão mecânica associada ao aquecimento controlado rompe as cabeças dos tricomas glandulares, expelindo o óleo resinoso diretamente sobre papel antiaderente para altas temperaturas.
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-700 block">
                  Etapas do Processo Rosin (Manual Astraya, pág. 19):
                </span>

                {[
                  {
                    step: 1,
                    title: 'Aquecimento e Ajuste da Prensa Térmica',
                    desc: 'Ligar a prensa de no mínimo 4 toneladas e calibrar a temperatura das placas térmicas com termômetro infravermelho.',
                  },
                  {
                    step: 2,
                    title: 'Fracionamento e Envelopamento em Bag 120u',
                    desc: 'Em temperatura ambiente, fragmentar a matéria curada em pedaços homogêneos e envelopar na rede filtradora de 120 micras.',
                  },
                  {
                    step: 3,
                    title: 'Posicionamento com Papel Antiaderente',
                    desc: 'Envolver a bag filtradora entre folhas de papel siliconado próprio para altas temperaturas e posicionar no centro das chapas.',
                  },
                  {
                    step: 4,
                    title: 'Prensagem a 4 Toneladas',
                    desc: 'Acionar a pressão hidráulica até atingir ~4t, mantendo o fluxo contínuo de escoamento da resina dourada.',
                  },
                  {
                    step: 5,
                    title: 'Resfriamento e Sanitização em Agitador Magnético',
                    desc: 'Após o resfriamento da resina, realizar a sanitização com álcool de cereais e evaporação lenta em baixa temperatura.',
                  },
                ].map((item) => (
                  <div key={item.step} className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex gap-2.5 items-start">
                    <div className="w-5 h-5 rounded bg-amber-600 text-white font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs">{item.title}</h4>
                      <p className="text-slate-600 text-[11px] mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SEC 12: ARMAZENAMENTO & DESCARBOXILAÇÃO (95°C / 35min) */}
          {activeSectionId === 'sec-12-armazenamento' && (
            <div className="space-y-4 text-xs text-slate-800 leading-relaxed">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-slate-900 font-bold text-xs uppercase">
                    <Thermometer className="w-3.5 h-3.5 text-blue-600" />
                    <span>Armazenamento & Estabilidade (Rastely et al.)</span>
                  </div>
                  <p className="text-[11px] text-slate-700">
                    Resinas devem ser conservadas entre <strong>5°C e 10°C</strong>, sem contato com oxigênio (fechamento a vácuo/gás inerte) e protegidas contra radiação ultravioleta em frascos âmbar para evitar degradação de THC em CBN.
                  </p>
                </div>

                <div className="bg-amber-50/70 p-3.5 rounded-lg border border-amber-200 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-amber-950 font-bold text-xs uppercase">
                    <Flame className="w-3.5 h-3.5 text-amber-700" />
                    <span>Descarboxilação Final Térmica</span>
                  </div>
                  <p className="text-[11px] text-slate-700">
                    O óleo final homogeneizado é submetido ao forno a <strong>95°C por 35 minutos</strong> com papel alumínio, convertendo eficientemente os ácidos canabinoides (CBDA, THCA) em suas formas ativas neutras (CBD, THC).
                  </p>
                </div>
              </div>

              {/* T-Check & UNICAMP CIATOX */}
              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 uppercase text-xs">
                    Controle de Qualidade Espectrométrico T-Check 3 & UNICAMP
                  </span>
                  <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                    Margem de Erro: ± 2%
                  </span>
                </div>
                <p className="text-[11px] text-slate-700">
                  Cada lote tem sua concentração aferida no espectrofotômetro T-Check com leitura óptica de absorbância. Os dados são confrontados a cada 8 a 12 meses com laudos cromatográficos do <strong>CIATOX / UNICAMP</strong>, laboratório autorizado pela Anvisa.
                </p>
              </div>
            </div>
          )}

          {/* SEC 13: FORMULAÇÕES ORAIS & PREPARO DE 1 FRASCO DE 30ML */}
          {activeSectionId === 'sec-13-oleos-orais' && (
            <div className="space-y-4 text-xs text-slate-800 leading-relaxed">
              <div className="bg-emerald-50/50 p-3 rounded-lg border border-emerald-200">
                <h4 className="font-bold text-emerald-950 text-xs uppercase mb-1">
                  Tabelas de Pesagem de Resina para 30 mL de Óleo TCM Oral
                </h4>
                <p className="text-slate-600 text-[11px]">
                  Parâmetros práticos calculados para atingir miligramagens exatas em frasco âmbar de 30 mL com carreador TCM grau farmacêutico.
                </p>
              </div>

              {/* Tabelas de Formulação */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
                {/* Alto CBD */}
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <div className="bg-blue-50 p-2 font-bold text-blue-900 border-b border-blue-200 flex justify-between items-center">
                    <span>1) Alto CBD (Cepa Ygriega 2.0)</span>
                    <span className="text-[10px] font-mono">30 mL TCM</span>
                  </div>
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 text-[10px] text-slate-500 uppercase border-b border-slate-100">
                      <tr>
                        <th className="p-2">Dose Total</th>
                        <th className="p-2">Concentração</th>
                        <th className="p-2 text-right">Peso Resina</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="p-2 font-medium">700 mg</td>
                        <td className="p-2">20 mg/mL</td>
                        <td className="p-2 text-right font-mono font-bold text-emerald-800">0,513 g</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-medium">1.500 mg</td>
                        <td className="p-2">50 mg/mL</td>
                        <td className="p-2 text-right font-mono font-bold text-emerald-800">1,100 g</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-medium">3.000 mg</td>
                        <td className="p-2">100 mg/mL</td>
                        <td className="p-2 text-right font-mono font-bold text-emerald-800">2,230 g</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Alto THC */}
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <div className="bg-amber-50 p-2 font-bold text-amber-900 border-b border-amber-200 flex justify-between items-center">
                    <span>2) Alto THC (Cepa Tha Melon)</span>
                    <span className="text-[10px] font-mono">30 mL TCM</span>
                  </div>
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 text-[10px] text-slate-500 uppercase border-b border-slate-100">
                      <tr>
                        <th className="p-2">Dose Total</th>
                        <th className="p-2">Concentração</th>
                        <th className="p-2 text-right">Peso Resina</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="p-2 font-medium">700 mg</td>
                        <td className="p-2">23 mg/mL</td>
                        <td className="p-2 text-right font-mono font-bold text-amber-800">0,493 g</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-medium">1.500 mg</td>
                        <td className="p-2">50 mg/mL</td>
                        <td className="p-2 text-right font-mono font-bold text-amber-800">1,040 g</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-medium">3.000 mg</td>
                        <td className="p-2">100 mg/mL</td>
                        <td className="p-2 text-right font-mono font-bold text-amber-800">2,000 g</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* POP de Preparo de 1 Frasco de 30 mL */}
              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-700 block">
                  Modo de Preparo de 1 Frasco de 30 mL (Manual Astraya, pág. 22-24):
                </span>
                <div className="space-y-1.5 text-[11px] text-slate-700">
                  <p><strong>1. Esterilização:</strong> Limpar tampa de plástico e pipeta com álcool 96%. Levar becker e frasco de vidro ao forno a 110°C por 10 minutos.</p>
                  <p><strong>2. Pesagem com TARE:</strong> Colocar o becker na balança de precisão, tarar e pesar a quantidade exata de resina conforme a dosagem desejada.</p>
                  <p><strong>3. Medição de TCM:</strong> Medir 30 mL de óleo carreador TCM em outro becker graduado.</p>
                  <p><strong>4. Aquecimento a 45°C:</strong> Levar ambos os béqueres (resina e TCM) ao fogão elétrico a 45°C por 5 minutos.</p>
                  <p><strong>5. Homogeneização Magnética:</strong> Despejar o TCM morno sobre a resina no agitador magnético por 10 a 15 minutos até dissolução 100% homogênea.</p>
                  <p><strong>6. Enfrasque Provisório:</strong> Transferir para o frasco esterilizado e fechar com papel alumínio.</p>
                  <p><strong>7. Identificação Provisória:</strong> Anotar na etiqueta provisória o peso de resina, nome do paciente, mg/mL e cepa.</p>
                  <p><strong>8. Descarboxilação no Forno:</strong> Levar o frasco tampado ao forno a 95°C por 35 minutos.</p>
                  <p><strong>9. Montagem e Verificação:</strong> Remover o papel alumínio, inserir cânula/tampa/lacre e inspecionar cor e limpidez visual.</p>
                  <p><strong>10. Leitura T-Check & Rotulagem:</strong> Aferir miligramagem no T-Check e aplicar o rótulo definitivo com validade e lote.</p>
                </div>
              </div>
            </div>
          )}

          {/* SEC 14: FORMULAÇÕES DERMATOLÓGICAS (CÓD. 13, 17 e 18) */}
          {activeSectionId === 'sec-14-dermatologicos' && (
            <div className="space-y-4 text-xs text-slate-800 leading-relaxed">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px]">
                {/* Óleo de Massagem Cód 13 */}
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-mono">
                      CÓD. 13
                    </span>
                    <h4 className="font-bold text-slate-900 text-xs mt-1">Óleo de Massagem para Dores</h4>
                    <p className="text-slate-500 text-[10px] mt-0.5">Dose: 40mg THC em 60mL TCM</p>
                    <ul className="mt-2 space-y-1 text-slate-600 text-[10.5px]">
                      <li>• 390 mL Óleo de Abacate</li>
                      <li>• 100 mL Óleo de Semente de Uva</li>
                      <li>• 90 mL Óleo Coco c/ Macassá</li>
                      <li>• 20 mL Extrato TCM descarb.</li>
                      <li>• 40 gotas Extrato de Arnica</li>
                      <li>• 40 gotas Blend Hortelã/Alecrim/Cedro/Laranja</li>
                    </ul>
                  </div>
                  <span className="text-[10px] text-slate-500 block pt-2 border-t border-slate-200 mt-2">
                    Lote padrão: 10 frascos (600 mL)
                  </span>
                </div>

                {/* Creme Hidratante Cód 17 */}
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded font-mono">
                      CÓD. 17
                    </span>
                    <h4 className="font-bold text-slate-900 text-xs mt-1">Creme Hidratante CBDA & Macela</h4>
                    <p className="text-slate-500 text-[10px] mt-0.5">Dose: 22mg em 50g</p>
                    <ul className="mt-2 space-y-1 text-slate-600 text-[10.5px]">
                      <li>• 250 g Base Hidratante 1/1</li>
                      <li>• 50 g Manteiga de Manga líquida</li>
                      <li>• 50 g Óleo de Coco líquido</li>
                      <li>• 75 g Óleo de Abacate</li>
                      <li>• 20 mL Extrato TCM descarb.</li>
                      <li>• 78 g Tintura Macela + 78 g Tintura CBDA geladas</li>
                      <li>• 65 gotas Blend Lavanda/LemonGrass/Laranja</li>
                    </ul>
                  </div>
                  <span className="text-[10px] text-slate-500 block pt-2 border-t border-slate-200 mt-2">
                    Lote padrão: 10 potes âmbar (500 g)
                  </span>
                </div>

                {/* Pomada Transdérmica Cód 18 */}
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase bg-purple-100 text-purple-800 px-1.5 py-0.2 rounded font-mono">
                      CÓD. 18
                    </span>
                    <h4 className="font-bold text-slate-900 text-xs mt-1">Pomada Transdérmica Karité</h4>
                    <p className="text-slate-500 text-[10px] mt-0.5">Dose: 22mg CBD em 30g</p>
                    <ul className="mt-2 space-y-1 text-slate-600 text-[10.5px]">
                      <li>• 90 g Cera de Abelha</li>
                      <li>• 74 g Óleo de Coco</li>
                      <li>• 35 g Manteiga de Karité</li>
                      <li>• 35 g Manteiga de Manga</li>
                      <li>• 18 g Extrato diluído em TCM</li>
                      <li>• 50 g Óleo Semente de Uva</li>
                      <li>• 35 gotas Blend Lavanda/Lemon/Laranja</li>
                    </ul>
                  </div>
                  <span className="text-[10px] text-slate-500 block pt-2 border-t border-slate-200 mt-2">
                    Envase a quente: 10 frascos (300 g)
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* SEC 15: TABELAS DE DOSAGEM PARA PRESCRITORES */}
          {activeSectionId === 'sec-15-prescritores' && (
            <div className="space-y-4 text-xs text-slate-800 leading-relaxed">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <h4 className="font-bold text-slate-900 text-xs uppercase mb-0.5">
                  Tabela Posológica Informativa para Médicos e Prescritores (pág. 28)
                </h4>
                <p className="text-slate-600 text-[11px]">
                  Relação de miligramas de fitocanabinoides entregues por fração de mililitro nos frascos de 30 mL.
                </p>
              </div>

              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-left text-[11px] text-slate-700">
                  <thead className="bg-slate-100 text-[10px] font-bold text-slate-600 uppercase border-b border-slate-200">
                    <tr>
                      <th className="p-2.5">Produto / Formulação</th>
                      <th className="p-2.5 text-center">1,0 mL</th>
                      <th className="p-2.5 text-center">0,75 mL</th>
                      <th className="p-2.5 text-center">0,50 mL</th>
                      <th className="p-2.5 text-center">0,25 mL</th>
                      <th className="p-2.5 text-center">0,10 mL</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    <tr className="bg-blue-50/30">
                      <td className="p-2 font-sans font-bold text-slate-900">Óleo TCM CBD 700 mg</td>
                      <td className="p-2 text-center font-bold text-slate-900">23,0 mg</td>
                      <td className="p-2 text-center text-slate-700">17,25 mg</td>
                      <td className="p-2 text-center text-slate-700">11,5 mg</td>
                      <td className="p-2 text-center text-slate-700">5,75 mg</td>
                      <td className="p-2 text-center text-slate-700">2,3 mg</td>
                    </tr>
                    <tr className="bg-blue-50/30">
                      <td className="p-2 font-sans font-bold text-slate-900">Óleo TCM CBD 1.500 mg</td>
                      <td className="p-2 text-center font-bold text-slate-900">50,0 mg</td>
                      <td className="p-2 text-center text-slate-700">37,50 mg</td>
                      <td className="p-2 text-center text-slate-700">25,0 mg</td>
                      <td className="p-2 text-center text-slate-700">12,50 mg</td>
                      <td className="p-2 text-center text-slate-700">5,0 mg</td>
                    </tr>
                    <tr className="bg-blue-50/30">
                      <td className="p-2 font-sans font-bold text-slate-900">Óleo TCM CBD 3.000 mg</td>
                      <td className="p-2 text-center font-bold text-slate-900">100,0 mg</td>
                      <td className="p-2 text-center text-slate-700">75,00 mg</td>
                      <td className="p-2 text-center text-slate-700">50,0 mg</td>
                      <td className="p-2 text-center text-slate-700">25,00 mg</td>
                      <td className="p-2 text-center text-slate-700">10,0 mg</td>
                    </tr>
                    <tr className="bg-amber-50/30">
                      <td className="p-2 font-sans font-bold text-slate-900">Óleo TCM THC 700 mg</td>
                      <td className="p-2 text-center font-bold text-slate-900">23,0 mg</td>
                      <td className="p-2 text-center text-slate-700">17,25 mg</td>
                      <td className="p-2 text-center text-slate-700">11,5 mg</td>
                      <td className="p-2 text-center text-slate-700">5,75 mg</td>
                      <td className="p-2 text-center text-slate-700">2,3 mg</td>
                    </tr>
                    <tr className="bg-amber-50/30">
                      <td className="p-2 font-sans font-bold text-slate-900">Óleo TCM THC 1.000 mg</td>
                      <td className="p-2 text-center font-bold text-slate-900">33,0 mg</td>
                      <td className="p-2 text-center text-slate-700">24,75 mg</td>
                      <td className="p-2 text-center text-slate-700">16,5 mg</td>
                      <td className="p-2 text-center text-slate-700">8,25 mg</td>
                      <td className="p-2 text-center text-slate-700">3,3 mg</td>
                    </tr>
                    <tr className="bg-amber-50/30">
                      <td className="p-2 font-sans font-bold text-slate-900">Óleo TCM THC 3.000 mg</td>
                      <td className="p-2 text-center font-bold text-slate-900">100,0 mg</td>
                      <td className="p-2 text-center text-slate-700">75,00 mg</td>
                      <td className="p-2 text-center text-slate-700">50,0 mg</td>
                      <td className="p-2 text-center text-slate-700">25,00 mg</td>
                      <td className="p-2 text-center text-slate-700">10,0 mg</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SEC 16, 17 & 18: METROLOGIA, RNC & REFERÊNCIAS */}
          {(activeSectionId === 'sec-16-equipamentos' || activeSectionId === 'sec-17-gestao-residuos' || activeSectionId === 'sec-18-referencias') && (
            <div className="space-y-4 text-xs text-slate-800 leading-relaxed">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-slate-700 block">
                    Calibração e Manutenção Rastreável (INMETRO / RBC)
                  </span>
                  <p className="text-slate-600 text-[11px]">
                    Equipamentos críticos (balanças de precisão, T-Check, fornos termostatizados) contam com identificação patrimonial e etiquetas com data de validade de calibração. É terminantemente proibido utilizar instrumentos com calibração vencida.
                  </p>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-slate-700 block">
                    Tratamento de Não Conformidades (RNC)
                  </span>
                  <p className="text-slate-600 text-[11px]">
                    Qualquer desvio nos parâmetros de temperatura, pesagem ou pureza deve ser formalizado via RNC, registrando contenção imediata, causa-raiz e ação preventiva encaminhada à Diretoria.
                  </p>
                </div>
              </div>

              {/* Referências Técnicas Oficiais */}
              <div className="border border-slate-200 rounded-lg p-3.5 bg-slate-50 space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-700 block">
                  Legislação e Referências Técnicas Pertinentes (pág. 34):
                </span>
                <ul className="space-y-1 text-[11px] text-slate-700 list-disc pl-4">
                  <li><strong>RDC nº 512/2021:</strong> Boas Práticas para Laboratórios de Controle de Qualidade (ANVISA).</li>
                  <li><strong>ISO/IEC 17025:</strong> Requisitos Gerais para Competência de Laboratórios de Ensaio e Calibração.</li>
                  <li><strong>ABNT NBR 14725:2023:</strong> Sistema Globalmente Harmonizado de Classificação e Rotulagem de Produtos Químicos (GHS).</li>
                  <li><strong>Norma Regulamentadora NR-23:</strong> Proteção Contra Incêndios e Prevenção de Sinistros.</li>
                  <li><strong>Farmacopeia Brasileira 7ª Edição HT-01:</strong> Inclusão da <em>Cannabis sativa L.</em> (Código: PM150-00) e Farmácia Viva RDC nº 18.</li>
                  <li><strong>Booth et al. (Plant Physiology 2020):</strong> <em>Terpene Synthases and Terpene Variation in Cannabis sativa</em> (GC-MS de 48 picos terpênicos).</li>
                  <li><strong>Teräsvalli, Heini (2020):</strong> <em>Extraction and purification of cannabidiol</em> (Solid-liquid extraction and winterization).</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
