import { useState } from 'react'
import { Routes, Route, Link, useParams, useNavigate, useLocation, useSearchParams } from 'react-router-dom'
import './App.css'

const NAV_ITEMS = [
  { id: 'new', label: 'Новые', count: 5 },
  { id: 'in_progress', label: 'В работе', count: 12 },
  { id: 'completed', label: 'Исполненные', count: 7 },
  { id: 'cancelled', label: 'Отмененные', count: 3 },
]

const STATUS_CONFIG = {
  new: { label: 'Новая', className: 'status-new' },
  in_progress: { label: 'В работе', className: 'status-in-progress' },
  completed: { label: 'Исполнена', className: 'status-completed' },
  cancelled: { label: 'Отменена', className: 'status-cancelled' },
}

const MOCK_APPLICATIONS = [
  { id: 1, number: '1234', applicant: 'ИП Ахметов', address: 'г. Алматы', status: 'in_progress', date: '12.02.2026' },
  { id: 2, number: '1235', applicant: 'ТОО ЕнергоСтрой', address: 'г. Астана', status: 'new', date: '12.02.2026' },
  { id: 3, number: '1236', applicant: 'ИП Петров', address: 'г. Шымкент', status: 'completed', date: '11.02.2026' },
  { id: 4, number: '1237', applicant: 'АО Казахтелеком', address: 'г. Алматы', status: 'cancelled', date: '11.02.2026' },
  { id: 5, number: '1238', applicant: 'ИП Сидорова', address: 'г. Астана', status: 'in_progress', date: '10.02.2026' },
  { id: 6, number: '1239', applicant: 'Иванов Иван', address: 'г. Алматы', status: 'new', date: '09.02.2026' },
  { id: 7, number: '1240', applicant: 'Петрова Анна', address: 'г. Астана', status: 'in_progress', date: '09.02.2026' },
  { id: 8, number: '1241', applicant: 'Смагулов Нурлан', address: 'г. Шымкент', status: 'completed', date: '08.02.2026' },
  { id: 9, number: '1242', applicant: 'Дуйсенова Айгерим', address: 'г. Алматы', status: 'in_progress', date: '08.02.2026' },
  { id: 10, number: '1243', applicant: 'Ким Алексей', address: 'г. Астана', status: 'new', date: '07.02.2026' },
]

const MOCK_DOCUMENTS = [
  { id: 1, name: 'Док 1', docType: 'Удостоверение личности', accepted: true, aiComment: '' },
  { id: 2, name: 'Док 2', docType: 'Договор купли-продажи', accepted: false, aiComment: 'Нечитаемый скан. Требуется повторная загрузка.' },
  { id: 3, name: 'Док 3', docType: 'Заявление', accepted: true, aiComment: '' },
  { id: 4, name: 'Док 4', docType: 'Расчёты', accepted: false, aiComment: 'Отсутствует печать на стр. 2.' },
  { id: 5, name: 'Док 5', docType: 'Свидетельство о постановке на учёт', accepted: true, aiComment: '' },
  { id: 6, name: 'Док 6', docType: 'Выписка из реестра', accepted: true, aiComment: 'Документ соответствует требованиям.' },
]

const MOCK_RECOMMENDED_TP = [
  { id: 1, number: '1100', distance: '0,32 км', capacity: '100 кВА', rejected: false },
  { id: 2, number: '1110', distance: '0,45 км', capacity: '160 кВА', rejected: false },
  { id: 3, number: '1231', distance: '0,58 км', capacity: '250 кВА', rejected: true },
]

const MOCK_TP_DETAIL = {
  typeTp: 'КТП',
  category: '3',
  voltageClass: '10',
  power: '630',
  balanceOwnership: 'РЭС-1',
  psNumber: 'ПС-46А',
  sectionsCount: '1',
  subscriberOwnership: 'АЖК',
  inventoryNumber: '5200034454',
  dispatchName: 'ТП-1443',
  description: 'КТП ТВВ',
  note: '',
  buildingInventoryNumber: '139',
  indicationOnOffNumber: '',
  indicationDate: '2004',
  technicalSpecNumber: '',
  technicalSpecDate: '',
}

const MOCK_ZAMERY_MANAT = [
  {
    section: 'Секция: 1',
    peak: 'Пик: 1',
    statusPercent: 100,
    columns: ['630', '910', '235', '236', '236', '409', '41', '411'],
    rows: [
      { direction: 'Гл. руб', ia: '', ib: 842, ic: 909, i0: 772, status: 116 },
      { direction: 'байдибек', ia: '', ib: 56, ic: 65, i0: 78, status: 0 },
      { direction: 'Юг', ia: '', ib: 47, ic: 55, i0: 9, status: 5 },
      { direction: 'Север', ia: '', ib: 150, ic: 145, i0: 50, status: 5 },
      { direction: 'уличное освещение', ia: '', ib: 19, ic: 29, i0: 10, status: 95 },
      { direction: 'Восток', ia: '', ib: 115, ic: 110, i0: 109, status: 6 },
      { direction: 'кя2', ia: '', ib: 35, ic: 65, i0: 55, status: 0 },
      { direction: 'кя-1', ia: '', ib: 420, ic: 440, i0: 461, status: 5 },
    ],
  },
  {
    section: 'Секция: 1',
    peak: 'Пик: 2',
    statusPercent: 86,
    columns: ['630', '910', '236', '236', '235', '401', '403', '408 Включен'],
    rows: [
      { direction: 'Гл. руб', ia: '', ib: 781, ic: 716, i0: 708, status: 0 },
      { direction: 'Юг', ia: '', ib: 106, ic: 110, i0: 108, status: 0 },
      { direction: 'Север', ia: '', ib: 156, ic: 78, i0: 89, status: 0 },
      { direction: 'мечеть', ia: '', ib: 10, ic: 18, i0: 0, status: 0 },
      { direction: 'Восток', ia: '', ib: 89, ic: 85, i0: 81, status: 0 },
      { direction: 'гор свет', ia: '', ib: 30, ic: 30, i0: 25, status: 0 },
      { direction: 'кя1', ia: '', ib: 390, ic: 395, i0: 405, status: 0 },
    ],
  },
]

const MOCK_ZAMERY_SKADA = [
  { date: '15.02.2026', value: '124,5 кВт' },
  { date: '14.02.2026', value: '118,2 кВт' },
  { date: '13.02.2026', value: '131,0 кВт' },
  { date: '12.02.2026', value: '127,8 кВт' },
  { date: '11.02.2026', value: '119,4 кВт' },
]

function getRecommendationsRows() {
  const base = MOCK_TP_DETAIL
  const manatPeak1 = MOCK_ZAMERY_MANAT[0].rows[0]
  const manatPeak2 = MOCK_ZAMERY_MANAT[1].rows[0]
  const manatPeak3 = MOCK_ZAMERY_MANAT[1].rows[6]
  return MOCK_RECOMMENDED_TP.map((tp, index) => {
    const manat = index === 0 ? manatPeak1 : index === 1 ? manatPeak2 : manatPeak3
    return {
      id: tp.id,
      tpNumber: tp.number,
      power: tp.capacity,
      psNumber: base.psNumber,
      voltageClass: base.voltageClass,
      ia: manat.ia || '—',
      ib: manat.ib,
      ic: manat.ic,
    }
  })
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  )
}

function RefreshIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
      <path d="M16 21h5v-5" />
    </svg>
  )
}

function LogoutIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  )
}

function SortIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m7 15 5 5 5-5" />
      <path d="m7 9 5-5 5 5" />
    </svg>
  )
}

function CaretRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 18 6-6-6-6" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function CrossIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

function MagnifierIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  )
}

function ExpandIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6" />
    </svg>
  )
}

function OperatorList() {
  const [activeNav, setActiveNav] = useState('in_progress')
  const [searchQuery, setSearchQuery] = useState('')
  const location = useLocation()
  const isEngineer = location.pathname.startsWith('/engineer')

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">Заявки</h1>
      </header>

      <div className="app-body">
        <aside className="sidebar">
          <div className="search-wrap">
            <span className="search-icon" aria-hidden><SearchIcon /></span>
            <input
              type="search"
              className="search-input"
              placeholder="Поиск..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Поиск"
            />
          </div>
          <nav className="sidebar-nav">
            <h2 className="sidebar-nav-title">Заявки</h2>
            <ul className="sidebar-nav-list">
              {NAV_ITEMS.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    className={`sidebar-nav-item ${activeNav === item.id ? 'sidebar-nav-item--active' : ''}`}
                    onClick={() => setActiveNav(item.id)}
                  >
                    <span className="sidebar-nav-label">{item.label}</span>
                    <span className={`sidebar-nav-badge ${activeNav === item.id ? 'sidebar-nav-badge--active' : ''}`}>
                      {item.count}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <main className="main">
          <div className="main-toolbar">
            <div className="main-toolbar-left">
              <h2 className="main-title">Заявки</h2>
              <nav className="cabinet-switcher" aria-label="Переключение кабинета">
                <Link to="/" className={`cabinet-switcher-link ${location.pathname === '/' ? 'cabinet-switcher-link--active' : ''}`}>
                  Оператор
                </Link>
                <Link to="/engineer" className={`cabinet-switcher-link ${location.pathname.startsWith('/engineer') ? 'cabinet-switcher-link--active' : ''}`}>
                  Инженер
                </Link>
                <Link to="/master" className={`cabinet-switcher-link ${location.pathname.startsWith('/master') ? 'cabinet-switcher-link--active' : ''}`}>
                  Мастер
                </Link>
              </nav>
            </div>
            <div className="main-actions">
              <button type="button" className="btn-text">
                <RefreshIcon />
                <span>Обновить</span>
              </button>
              <button type="button" className="btn-text">
                <LogoutIcon />
                <span>Выйти</span>
              </button>
            </div>
          </div>

          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th className="col-number">
                    <span className="th-sort-wrap">
                      Номер
                      <span className="sort-icon" aria-hidden><SortIcon /></span>
                    </span>
                  </th>
                  <th className="col-applicant">Заявитель</th>
                  <th className="col-address">Адрес</th>
                  <th className="col-status">Статус</th>
                  <th className="col-date">Дата</th>
                  <th className="col-actions">Действия</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_APPLICATIONS.map((row) => {
                  const status = STATUS_CONFIG[row.status]
                  const masterRev = (() => {
                    if (!isEngineer) return null
                    try {
                      const raw = sessionStorage.getItem(`master_revision_${row.number}`)
                      return raw ? JSON.parse(raw) : null
                    } catch (_) {
                      return null
                    }
                  })()
                  const approvedTp = masterRev?.tp || null
                  return (
                    <tr key={row.id}>
                      <td className="col-number">#{row.number}</td>
                      <td className="col-applicant">{row.applicant}</td>
                      <td className="col-address">{row.address}</td>
                      <td className="col-status">
                        {isEngineer && approvedTp ? (
                          <Link
                            to={`/engineer/request/${row.number}/recommendations?tp=${approvedTp}`}
                            className="badge badge-approved"
                            title="Открыть утвержденную рекомендацию"
                          >
                            Утверждено
                          </Link>
                        ) : (
                          <span className={`badge ${status.className}`}>{status.label}</span>
                        )}
                      </td>
                      <td className="col-date">{row.date}</td>
                      <td className="col-actions">
                        {isEngineer ? (
                          approvedTp ? (
                            <Link to={`/engineer/request/${row.number}/recommendations?tp=${approvedTp}`} className="btn-primary">
                              Открыть рекомендацию
                              <CaretRightIcon />
                            </Link>
                          ) : (
                            <Link to={`/engineer/request/${row.number}`} className="btn-primary">
                              Взять в работу
                              <CaretRightIcon />
                            </Link>
                          )
                        ) : (
                          <Link to={`/request/${row.number}`} className="btn-primary">
                            Открыть
                            <CaretRightIcon />
                          </Link>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  )
}

function RequestDetailSidebar() {
  const [activeNav, setActiveNav] = useState('in_progress')
  const [searchQuery, setSearchQuery] = useState('')
  return (
    <aside className="sidebar">
      <div className="search-wrap">
        <span className="search-icon" aria-hidden><SearchIcon /></span>
        <input
          type="search"
          className="search-input"
          placeholder="Поиск..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Поиск"
        />
      </div>
      <nav className="sidebar-nav">
        <h2 className="sidebar-nav-title">Заявки</h2>
        <ul className="sidebar-nav-list">
          {NAV_ITEMS.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                className={`sidebar-nav-item ${activeNav === item.id ? 'sidebar-nav-item--active' : ''}`}
                onClick={() => setActiveNav(item.id)}
              >
                <span className="sidebar-nav-label">{item.label}</span>
                <span className={`sidebar-nav-badge ${activeNav === item.id ? 'sidebar-nav-badge--active' : ''}`}>
                  {item.count}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}

function RequestDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [previewDoc, setPreviewDoc] = useState(null)
  const [operatorComment, setOperatorComment] = useState('')
  const request = MOCK_APPLICATIONS.find((r) => r.number === id)

  if (!request) {
    return (
      <div className="app">
        <main className="main">
          <p>Заявка не найдена.</p>
          <button type="button" className="btn-primary" onClick={() => navigate(-1)}>
            Назад
          </button>
        </main>
      </div>
    )
  }

  const location = useLocation()

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">Заявки</h1>
      </header>
      <div className="app-body">
        <RequestDetailSidebar />
        <main className="main request-detail-main">
          <div className="main-toolbar">
            <div className="main-toolbar-left">
              <h2 className="main-title">Заявка №{request.number}</h2>
              <nav className="cabinet-switcher" aria-label="Переключение кабинета">
                <Link to="/" className={`cabinet-switcher-link ${location.pathname === '/' ? 'cabinet-switcher-link--active' : ''}`}>
                  Оператор
                </Link>
                <Link to="/engineer" className={`cabinet-switcher-link ${location.pathname.startsWith('/engineer') ? 'cabinet-switcher-link--active' : ''}`}>
                  Инженер
                </Link>
                <Link to="/master" className={`cabinet-switcher-link ${location.pathname.startsWith('/master') ? 'cabinet-switcher-link--active' : ''}`}>
                  Мастер
                </Link>
              </nav>
            </div>
            <button type="button" className="btn-text" onClick={() => navigate(-1)}>
              Назад
            </button>
          </div>

          <div className="request-params">
            <div className="request-params-row">
              <div className="request-params-item">
                <span className="request-params-label">Дата подачи заявки</span>
                <span className="request-params-value">{request.date}</span>
              </div>
              <div className="request-params-item">
                <span className="request-params-label">Классификация заявки</span>
                <span className="request-params-value">Подключение к электросетям</span>
              </div>
              <div className="request-params-item">
                <span className="request-params-label">ИИН</span>
                <span className="request-params-value">850101300123</span>
              </div>
            </div>
            <div className="request-params-row">
              <div className="request-params-item">
                <span className="request-params-label">Заявитель</span>
                <span className="request-params-value">{request.applicant}</span>
              </div>
              <div className="request-params-item">
                <span className="request-params-label">Объект</span>
                <span className="request-params-value">Жилой дом</span>
              </div>
              <div className="request-params-item">
                <span className="request-params-label">Признаки потребления</span>
                <span className="request-params-value">до 15 кВт</span>
              </div>
            </div>
            <div className="request-params-row">
              <div className="request-params-item">
                <span className="request-params-label">Адрес объекта</span>
                <span className="request-params-value">{request.address}, ул. Абая, 150</span>
              </div>
              <div className="request-params-item">
                <span className="request-params-label">Кадастровый номер</span>
                <span className="request-params-value">123-456-789-012</span>
              </div>
              <div className="request-params-item">
                <span className="request-params-label">На карте</span>
                <span className="request-params-value">
                  <button type="button" className="request-params-link">Показать на карте</button>
                </span>
              </div>
            </div>
          </div>

          <div className="doc-list">
            <div className="doc-list-header">
              <span className="doc-list-header-cell">Статус</span>
              <span className="doc-list-header-cell">Наименование документа</span>
              <span className="doc-list-header-cell">Тип документа</span>
              <span className="doc-list-header-cell doc-list-header-cell--preview" />
              <span className="doc-list-header-cell">Комментарий ИИ</span>
            </div>
            {MOCK_DOCUMENTS.map((doc) => (
              <div key={doc.id} className="doc-row">
                <span className={`doc-indicator ${doc.accepted ? 'doc-indicator--ok' : 'doc-indicator--problem'}`} title={doc.accepted ? 'Принят' : 'Есть проблема'}>
                  {doc.accepted ? <CheckIcon /> : <CrossIcon />}
                </span>
                <span className="doc-name">{doc.name}</span>
                <span className="doc-type">{doc.docType}</span>
                <button type="button" className="btn-outline" onClick={() => setPreviewDoc(doc)}>
                  Предпросмотр
                </button>
                <div className="doc-row-comment">
                  {doc.aiComment || '—'}
                </div>
              </div>
            ))}
          </div>

          <div className="operator-comment">
            <label htmlFor="operator-comment-input" className="operator-comment-label">
              Комментарий
            </label>
            <textarea
              id="operator-comment-input"
              className="recommendations-comment-input"
              placeholder="Комментарий оператора..."
              value={operatorComment}
              onChange={(e) => setOperatorComment(e.target.value)}
              rows={4}
            />
          </div>

          <footer className="request-detail-footer">
            <button type="button" className="btn-primary btn-primary--large">
              Принять
            </button>
            <button type="button" className="btn-secondary">
              Отправить на доработку
            </button>
          </footer>
        </main>
      </div>

      {previewDoc && (
        <div className="modal-overlay" onClick={() => setPreviewDoc(null)} role="dialog" aria-modal="true" aria-label="Предпросмотр документа">
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Предпросмотр — {previewDoc.name}</h3>
              <button type="button" className="modal-close" onClick={() => setPreviewDoc(null)} aria-label="Закрыть">
                ×
              </button>
            </div>
            <div className="modal-body">
              <p className="modal-stub">Здесь будет предпросмотр документа.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function EngineerRequestDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [selectedTpNumber, setSelectedTpNumber] = useState(null)
  const request = MOCK_APPLICATIONS.find((r) => r.number === id)

  if (!request) {
    return (
      <div className="app">
        <main className="main">
          <p>Заявка не найдена.</p>
          <button type="button" className="btn-primary" onClick={() => navigate(-1)}>
            Назад
          </button>
        </main>
      </div>
    )
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">Заявки</h1>
      </header>
      <div className="app-body">
        <RequestDetailSidebar />
        <main className="main request-detail-main engineer-request-main">
          <div className="main-toolbar">
            <div className="main-toolbar-left">
              <h2 className="main-title">Заявка №{request.number}</h2>
              <nav className="cabinet-switcher" aria-label="Переключение кабинета">
                <Link to="/" className={`cabinet-switcher-link ${location.pathname === '/' ? 'cabinet-switcher-link--active' : ''}`}>
                  Оператор
                </Link>
                <Link to="/engineer" className={`cabinet-switcher-link ${location.pathname.startsWith('/engineer') ? 'cabinet-switcher-link--active' : ''}`}>
                  Инженер
                </Link>
                <Link to="/master" className={`cabinet-switcher-link ${location.pathname.startsWith('/master') ? 'cabinet-switcher-link--active' : ''}`}>
                  Мастер
                </Link>
              </nav>
            </div>
            <button type="button" className="btn-text" onClick={() => navigate(-1)}>
              Назад
            </button>
          </div>

          <div className="request-params">
            <div className="request-params-row">
              <div className="request-params-item">
                <span className="request-params-label">Дата подачи заявки</span>
                <span className="request-params-value">{request.date}</span>
              </div>
              <div className="request-params-item">
                <span className="request-params-label">Классификация заявки</span>
                <span className="request-params-value">Подключение к электросетям</span>
              </div>
              <div className="request-params-item">
                <span className="request-params-label">ИИН</span>
                <span className="request-params-value">850101300123</span>
              </div>
            </div>
            <div className="request-params-row">
              <div className="request-params-item">
                <span className="request-params-label">Заявитель</span>
                <span className="request-params-value">{request.applicant}</span>
              </div>
              <div className="request-params-item">
                <span className="request-params-label">Объект</span>
                <span className="request-params-value">Жилой дом</span>
              </div>
              <div className="request-params-item">
                <span className="request-params-label">Признаки потребления</span>
                <span className="request-params-value">до 15 кВт</span>
              </div>
            </div>
            <div className="request-params-row">
              <div className="request-params-item">
                <span className="request-params-label">Адрес объекта</span>
                <span className="request-params-value">{request.address}, ул. Абая, 150</span>
              </div>
              <div className="request-params-item">
                <span className="request-params-label">Кадастровый номер</span>
                <span className="request-params-value">123-456-789-012</span>
              </div>
              <div className="request-params-item">
                <span className="request-params-label">На карте</span>
                <span className="request-params-value">
                  <button type="button" className="request-params-link">Показать на карте</button>
                </span>
              </div>
            </div>
          </div>

          <section className="engineer-map-section">
            <div className="engineer-map-header">
              <h3 className="engineer-map-title">Карта</h3>
              <button type="button" className="engineer-map-expand" title="Развернуть на весь экран" aria-label="Развернуть карту">
                <ExpandIcon />
              </button>
            </div>
            <div className="engineer-map-placeholder">
              <div className="engineer-map-pin engineer-map-pin--consumer" title="Участок потребителя" style={{ bottom: '42%', left: '50%', transform: 'translate(-50%, 0)' }}>
                <span className="engineer-map-pin-dot" />
                <span className="engineer-map-pin-label">Участок</span>
              </div>
              <div className="engineer-map-pin engineer-map-pin--tp" style={{ top: '18%', left: '22%' }} title="ТП 1100">
                <span className="engineer-map-pin-dot" />
                <span className="engineer-map-pin-label">ТП 1100</span>
              </div>
              <div className="engineer-map-pin engineer-map-pin--tp" style={{ top: '28%', right: '25%' }} title="ТП 1110">
                <span className="engineer-map-pin-dot" />
                <span className="engineer-map-pin-label">ТП 1110</span>
              </div>
              <div className="engineer-map-pin engineer-map-pin--tp" style={{ bottom: '22%', left: '30%' }} title="ТП 1231">
                <span className="engineer-map-pin-dot" />
                <span className="engineer-map-pin-label">ТП 1231</span>
              </div>
            </div>
          </section>

          <section className="engineer-ai-result">
            <h3 className="engineer-ai-result-title">Результат ИИ</h3>
            <div className="engineer-ai-result-table-wrap">
              <table className="engineer-ai-result-table">
                <thead>
                  <tr>
                    <th className="engineer-ai-result-col-select" />
                    <th>№</th>
                    <th>ТП</th>
                    <th>Расстояние</th>
                    <th>Мощность</th>
                    <th>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_RECOMMENDED_TP.map((tp, index) => (
                    <tr key={tp.id} className={tp.rejected ? 'engineer-ai-result-row--rejected' : ''}>
                      <td className="engineer-ai-result-col-select">
                        <input
                          type="radio"
                          name="selectedTp"
                          value={tp.number}
                          checked={selectedTpNumber === tp.number}
                          onChange={() => setSelectedTpNumber(tp.number)}
                          id={`tp-select-${tp.number}`}
                          className="engineer-ai-result-radio"
                          aria-label={`Выбрать ТП ${tp.number}`}
                        />
                      </td>
                      <td>{index + 1})</td>
                      <td>ТП {tp.number}</td>
                      <td>{tp.distance}</td>
                      <td>{tp.capacity}</td>
                      <td>
                        <Link to={`/engineer/request/${id}/tp/${tp.number}`} className="btn-icon" title="Подробнее">
                          <MagnifierIcon />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="engineer-ai-result-footer">
              {selectedTpNumber ? (
                <Link to={`/engineer/request/${id}/recommendations?tp=${selectedTpNumber}`} className="btn-primary btn-primary--large">
                  Сформировать рекомендации
                </Link>
              ) : (
                <button type="button" className="btn-primary btn-primary--large" disabled title="Выберите одну ТП из таблицы">
                  Сформировать рекомендации
                </button>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

function TpDetailPage() {
  const { id, tpNumber } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [expertSectionExpanded, setExpertSectionExpanded] = useState(false)
  const d = MOCK_TP_DETAIL
  const backUrl = `/engineer/request/${id}`

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">Заявки</h1>
      </header>
      <div className="app-body">
        <RequestDetailSidebar />
        <main className="main request-detail-main tp-detail-page">
          <div className="main-toolbar">
            <div className="main-toolbar-left">
              <h2 className="main-title">ТП {tpNumber}</h2>
              <nav className="cabinet-switcher" aria-label="Переключение кабинета">
                <Link to="/" className={`cabinet-switcher-link ${location.pathname === '/' ? 'cabinet-switcher-link--active' : ''}`}>
                  Оператор
                </Link>
                <Link to="/engineer" className={`cabinet-switcher-link ${location.pathname.startsWith('/engineer') ? 'cabinet-switcher-link--active' : ''}`}>
                  Инженер
                </Link>
                <Link to="/master" className={`cabinet-switcher-link ${location.pathname.startsWith('/master') ? 'cabinet-switcher-link--active' : ''}`}>
                  Мастер
                </Link>
              </nav>
            </div>
            <button type="button" className="btn-text" onClick={() => navigate(backUrl)}>
              Назад
            </button>
          </div>

          <section className="tp-detail-section">
            <h3 className="tp-detail-section-title">Общая информация</h3>
            <div className="tp-detail-card">
              <dl className="tp-detail-list">
                <div className="tp-detail-row"><dt>Тип ТП</dt><dd>{d.typeTp}</dd></div>
                <div className="tp-detail-row"><dt>Категория</dt><dd>{d.category}</dd></div>
                <div className="tp-detail-row"><dt>Класс напряжения</dt><dd>{d.voltageClass}</dd></div>
                <div className="tp-detail-row"><dt>Мощность</dt><dd>{d.power}</dd></div>
                <div className="tp-detail-row"><dt>Балансовая принадлежность</dt><dd>{d.balanceOwnership}</dd></div>
                <div className="tp-detail-row"><dt>Номер ПС</dt><dd>{d.psNumber}</dd></div>
                <div className="tp-detail-row"><dt>Количество секций</dt><dd>{d.sectionsCount}</dd></div>
                <div className="tp-detail-row"><dt>Принадлежность (абонентская)</dt><dd>{d.subscriberOwnership}</dd></div>
                <div className="tp-detail-row"><dt>Инвентарный номер</dt><dd>{d.inventoryNumber}</dd></div>
                <div className="tp-detail-row"><dt>Диспетчерское наименование</dt><dd>{d.dispatchName}</dd></div>
                <div className="tp-detail-row"><dt>Описание</dt><dd>{d.description}</dd></div>
                <div className="tp-detail-row"><dt>Примечание</dt><dd>{d.note || '—'}</dd></div>
                <div className="tp-detail-row"><dt>Инвентарный номер здания</dt><dd>{d.buildingInventoryNumber}</dd></div>
                <div className="tp-detail-row"><dt>Указание вкл., откл. (номер)</dt><dd>{d.indicationOnOffNumber || '—'}</dd></div>
                <div className="tp-detail-row"><dt>Указание (дата)</dt><dd>{d.indicationDate || '—'}</dd></div>
                <div className="tp-detail-row"><dt>Технические условия (номер)</dt><dd>{d.technicalSpecNumber || '—'}</dd></div>
                <div className="tp-detail-row"><dt>Технические условия (дата)</dt><dd>{d.technicalSpecDate || '—'}</dd></div>
              </dl>
              <div className="tp-detail-collapse">
                <button type="button" className="tp-detail-collapse-trigger" onClick={() => setExpertSectionExpanded(!expertSectionExpanded)} aria-expanded={expertSectionExpanded}>
                  <span className={`tp-detail-collapse-icon ${expertSectionExpanded ? 'tp-detail-collapse-icon--open' : ''}`}>▸</span>
                  Оценки экспертные и финансовые
                </button>
                {expertSectionExpanded && (
                  <div className="tp-detail-collapse-content">
                    <p className="tp-detail-stub">Здесь будут экспертные и финансовые оценки.</p>
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className="tp-detail-section">
            <h3 className="tp-detail-section-title">Замеры</h3>

            <div className="zamery-subsection">
              <h4 className="zamery-subsection-title">Манат</h4>
              {MOCK_ZAMERY_MANAT.map((block, blockIndex) => (
                <div key={blockIndex} className="zamery-manat-block">
                  <div className="zamery-manat-header">
                    <span className="zamery-manat-peak">{block.peak}</span>
                    <span className="zamery-manat-status">
                      <span className="zamery-manat-status-bar" style={{ width: `${block.statusPercent}%` }} />
                      <span className="zamery-manat-status-text">{block.statusPercent} %</span>
                    </span>
                  </div>
                  <div className="zamery-manat-table-wrap">
                    <table className="zamery-manat-table">
                      <thead>
                        <tr>
                          <th className="zamery-manat-col-direction">Направление</th>
                          <th>IA</th>
                          <th>IB</th>
                          <th>IC</th>
                          <th>I0</th>
                          <th className="zamery-manat-col-status">Состояние</th>
                        </tr>
                      </thead>
                      <tbody>
                        {block.rows.map((row, rowIndex) => (
                          <tr key={rowIndex}>
                            <td className="zamery-manat-col-direction">{row.direction}</td>
                            <td>{row.ia || '—'}</td>
                            <td>{row.ib}</td>
                            <td>{row.ic}</td>
                            <td>{row.i0}</td>
                            <td className="zamery-manat-col-status">{row.status}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>

            <div className="zamery-subsection">
              <h4 className="zamery-subsection-title">Скада</h4>
              <div className="zamery-skada-list">
                {MOCK_ZAMERY_SKADA.map((item, index) => (
                  <div key={index} className="zamery-skada-row">
                    <span className="zamery-skada-date">{item.date}</span>
                    <span className="zamery-skada-value">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

const DOC_KEYS = [
  'consumer', 'purpose', 'address', 'requestedPower', 'category', 'existingPower',
  'connectionPoint', 'tpType', 'tr1Imax', 'tr1S', 'tr2Imax', 'tr2S', 'yearCommissioning', 'loadImax', 'ps', 'feeder',
  'conditions', 'engineerComment',
]

const initialDocFromRequest = (request, chosenRow) => ({
  consumer: request?.applicant ?? '',
  purpose: request?.purpose ?? '',
  address: request?.address ?? '',
  requestedPower: chosenRow?.power ?? '',
  category: '',
  existingPower: '',
  connectionPoint: chosenRow?.tpNumber ?? '',
  tpType: '',
  tr1Imax: '',
  tr1S: '',
  tr2Imax: '',
  tr2S: '',
  yearCommissioning: '',
  loadImax: '',
  ps: chosenRow?.psNumber ?? '',
  feeder: '',
  conditions: '',
  engineerComment: '',
})

const getEmptyDoc = () => Object.fromEntries(DOC_KEYS.map((k) => [k, '']))

function RecommendationsPage() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const location = useLocation()
  const selectedTpFromUrl = searchParams.get('tp')
  const allRows = getRecommendationsRows()
  const masterRevision = (() => {
    try {
      const raw = sessionStorage.getItem(`master_revision_${id}`)
      return raw ? JSON.parse(raw) : null
    } catch (_) {
      return null
    }
  })()

  const selectedTp = selectedTpFromUrl || masterRevision?.tp || null
  const rows = selectedTp ? allRows.filter((r) => r.tpNumber === selectedTp) : []
  const chosenRow = rows.length > 0 ? rows[0] : null
  const request = MOCK_APPLICATIONS.find((r) => r.number === id)
  const backUrl = `/engineer/request/${id}`

  const [doc, setDoc] = useState(() => {
    const base = initialDocFromRequest(request, chosenRow)
    try {
      const raw = sessionStorage.getItem(`recommendation_${id}`)
      const saved = raw ? JSON.parse(raw) : null
      if (saved?.doc) return { ...base, ...saved.doc }
      if (saved?.comment) return { ...base, engineerComment: saved.comment }
    } catch (_) {}
    return base
  })

  const isApproved = Boolean(masterRevision)
  const viewDoc = isApproved
    ? { ...doc, ...(masterRevision?.doc || {}) }
    : doc

  const updateDoc = (key, value) => setDoc((prev) => ({ ...prev, [key]: value }))

  const handleSendForApproval = () => {
    if (!selectedTp || rows.length === 0) return
    try {
      sessionStorage.setItem(
        `recommendation_${id}`,
        JSON.stringify({ tp: selectedTp, comment: doc.engineerComment, doc })
      )
      sessionStorage.removeItem(`master_revision_${id}`)
    } catch (_) {}
    navigate(backUrl)
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">Заявки</h1>
      </header>
      <div className="app-body">
        <RequestDetailSidebar />
        <main className="main request-detail-main recommendations-page">
          <div className="main-toolbar">
            <div className="main-toolbar-left">
              <h2 className="main-title">Рекомендации</h2>
              <nav className="cabinet-switcher" aria-label="Переключение кабинета">
                <Link to="/" className={`cabinet-switcher-link ${location.pathname === '/' ? 'cabinet-switcher-link--active' : ''}`}>
                  Оператор
                </Link>
                <Link to="/engineer" className={`cabinet-switcher-link ${location.pathname.startsWith('/engineer') ? 'cabinet-switcher-link--active' : ''}`}>
                  Инженер
                </Link>
                <Link to="/master" className={`cabinet-switcher-link ${location.pathname.startsWith('/master') ? 'cabinet-switcher-link--active' : ''}`}>
                  Мастер
                </Link>
              </nav>
            </div>
            <button type="button" className="btn-text" onClick={() => navigate(backUrl)}>
              Назад
            </button>
          </div>

          {masterRevision && (
            <div className="master-revision-banner">
              <div className="master-revision-banner-content">
                <div>
                  <strong>Мастер утвердил рекомендацию.</strong>
                  {masterRevision.comment && (
                    <p className="master-revision-banner-comment">Коментарий Мастера: {masterRevision.comment}</p>
                  )}
                </div>
                <Link to={`/engineer/request/${id}/tu${selectedTp ? `?tp=${selectedTp}` : ''}`} className="btn-primary">
                  Сформировать ТУ
                  <CaretRightIcon />
                </Link>
              </div>
            </div>
          )}

          {rows.length === 0 ? (
            <div className="recommendations-empty-block">
              <p className="recommendations-empty">Данные не выбраны. Вернитесь и выберите одну ТП в таблице «Результат ИИ».</p>
              <button type="button" className="btn-outline" onClick={() => navigate(backUrl)}>
                Вернуться к заявке
              </button>
            </div>
          ) : (
            <>
              <div className={`tech-recommendation-doc ${isApproved ? 'tech-recommendation-doc--readonly' : ''}`}>
                <div className="tech-recommendation-header">
                  <div className="tech-recommendation-logo">АЖК АЛАТАУ ЖАРЫҚ КОМПАНИЯСЫ</div>
                  <div className="tech-recommendation-title-block">
                    <div>7-ші электр тораптар ауданы</div>
                    <div>Районные электрические сети №7</div>
                    <h2>Техническая рекомендация</h2>
                    <div className="tech-recommendation-page">стр. 1 из 1</div>
                  </div>
                </div>
                <p className="tech-recommendation-intro">
                  Рекомендации разработаны ПТГ РЭС - 7 на основе технической документации, для подготовки технических условий
                </p>
                <div className="tech-recommendation-table-wrap">
                  <table className="tech-recommendation-table">
                    <thead>
                      <tr>
                        <th>Потребитель</th>
                        <th>Целевое назначение объекта</th>
                        <th>Место расположения (адрес)</th>
                        <th>Запрашиваемая мощность</th>
                        <th>Категория эл.снабжения</th>
                        <th>Существующая мощность и точка подключения</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          {isApproved ? (viewDoc.consumer || '—') : (
                            <input type="text" className="tech-recommendation-input" value={viewDoc.consumer} onChange={(e) => updateDoc('consumer', e.target.value)} placeholder="—" />
                          )}
                        </td>
                        <td>
                          {isApproved ? (viewDoc.purpose || '—') : (
                            <input type="text" className="tech-recommendation-input" value={viewDoc.purpose} onChange={(e) => updateDoc('purpose', e.target.value)} placeholder="—" />
                          )}
                        </td>
                        <td>
                          {isApproved ? (viewDoc.address || '—') : (
                            <input type="text" className="tech-recommendation-input" value={viewDoc.address} onChange={(e) => updateDoc('address', e.target.value)} placeholder="—" />
                          )}
                        </td>
                        <td>
                          {isApproved ? (viewDoc.requestedPower || '—') : (
                            <input type="text" className="tech-recommendation-input" value={viewDoc.requestedPower} onChange={(e) => updateDoc('requestedPower', e.target.value)} placeholder="—" />
                          )}
                        </td>
                        <td>
                          {isApproved ? (viewDoc.category || '—') : (
                            <input type="text" className="tech-recommendation-input" value={viewDoc.category} onChange={(e) => updateDoc('category', e.target.value)} placeholder="—" />
                          )}
                        </td>
                        <td>
                          {isApproved ? (viewDoc.existingPower || '—') : (
                            <input type="text" className="tech-recommendation-input" value={viewDoc.existingPower} onChange={(e) => updateDoc('existingPower', e.target.value)} placeholder="—" />
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <h4 className="tech-recommendation-sub">Точка подключения от РУ-0,4кВ ТП (тип), КЯ, ЛЭП-0,4кВ</h4>
                <div className="tech-recommendation-table-wrap">
                  <table className="tech-recommendation-table tech-recommendation-table-second">
                    <thead>
                      <tr>
                        <th>Точка подключения</th>
                        <th>Тип ТП</th>
                        <th colSpan={2}>Характеристика тр-ра Тр. №1</th>
                        <th colSpan={2}>Характеристика тр-ра Тр. №2</th>
                        <th colSpan={2}>Хар-ка ЛЭП</th>
                        <th colSpan={2}>Норм. схема</th>
                      </tr>
                      <tr>
                        <th></th>
                        <th></th>
                        <th>Imax (A)</th>
                        <th>S (kVA)</th>
                        <th>Imax (A)</th>
                        <th>S (kVA)</th>
                        <th>Год ввода</th>
                        <th>Нагр. Imax (A)</th>
                        <th>ПС</th>
                        <th>Фид</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          {isApproved ? (viewDoc.connectionPoint || '—') : (
                            <input type="text" className="tech-recommendation-input" value={viewDoc.connectionPoint} onChange={(e) => updateDoc('connectionPoint', e.target.value)} placeholder="—" />
                          )}
                        </td>
                        <td>
                          {isApproved ? (viewDoc.tpType || '—') : (
                            <input type="text" className="tech-recommendation-input" value={viewDoc.tpType} onChange={(e) => updateDoc('tpType', e.target.value)} placeholder="—" />
                          )}
                        </td>
                        <td>
                          {isApproved ? (viewDoc.tr1Imax || '—') : (
                            <input type="text" className="tech-recommendation-input" value={viewDoc.tr1Imax} onChange={(e) => updateDoc('tr1Imax', e.target.value)} placeholder="—" />
                          )}
                        </td>
                        <td>
                          {isApproved ? (viewDoc.tr1S || '—') : (
                            <input type="text" className="tech-recommendation-input" value={viewDoc.tr1S} onChange={(e) => updateDoc('tr1S', e.target.value)} placeholder="—" />
                          )}
                        </td>
                        <td>
                          {isApproved ? (viewDoc.tr2Imax || '—') : (
                            <input type="text" className="tech-recommendation-input" value={viewDoc.tr2Imax} onChange={(e) => updateDoc('tr2Imax', e.target.value)} placeholder="—" />
                          )}
                        </td>
                        <td>
                          {isApproved ? (viewDoc.tr2S || '—') : (
                            <input type="text" className="tech-recommendation-input" value={viewDoc.tr2S} onChange={(e) => updateDoc('tr2S', e.target.value)} placeholder="—" />
                          )}
                        </td>
                        <td>
                          {isApproved ? (viewDoc.yearCommissioning || '—') : (
                            <input type="text" className="tech-recommendation-input" value={viewDoc.yearCommissioning} onChange={(e) => updateDoc('yearCommissioning', e.target.value)} placeholder="—" />
                          )}
                        </td>
                        <td>
                          {isApproved ? (viewDoc.loadImax || '—') : (
                            <input type="text" className="tech-recommendation-input" value={viewDoc.loadImax} onChange={(e) => updateDoc('loadImax', e.target.value)} placeholder="—" />
                          )}
                        </td>
                        <td>
                          {isApproved ? (viewDoc.ps || '—') : (
                            <input type="text" className="tech-recommendation-input" value={viewDoc.ps} onChange={(e) => updateDoc('ps', e.target.value)} placeholder="—" />
                          )}
                        </td>
                        <td>
                          {isApproved ? (viewDoc.feeder || '—') : (
                            <input type="text" className="tech-recommendation-input" value={viewDoc.feeder} onChange={(e) => updateDoc('feeder', e.target.value)} placeholder="—" />
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <h4 className="tech-recommendation-sub">Условия для подключения, требования по усилению сетей.</h4>
                {isApproved ? (
                  <>
                    <div className="master-review-conditions-readonly">{viewDoc.conditions || '—'}</div>
                    <div className="tech-recommendation-comment-row">
                      <label className="tech-recommendation-comment-label">Коментарий инженера</label>
                      <div className="master-review-conditions-readonly">{viewDoc.engineerComment || '—'}</div>
                    </div>
                    <div className="tech-recommendation-footer-row">
                      <div className="tech-recommendation-footer">Мастер РЭС-7</div>
                    </div>
                  </>
                ) : (
                  <>
                    <textarea
                      className="tech-recommendation-conditions-input"
                      value={viewDoc.conditions}
                      onChange={(e) => updateDoc('conditions', e.target.value)}
                      placeholder="Введите условия..."
                      rows={5}
                    />
                    <div className="tech-recommendation-comment-row">
                      <label className="tech-recommendation-comment-label">Коментарий инженера</label>
                      <input
                        type="text"
                        className="tech-recommendation-input tech-recommendation-comment-input"
                        value={viewDoc.engineerComment}
                        onChange={(e) => updateDoc('engineerComment', e.target.value)}
                        placeholder="Мнение / рекомендация инженера..."
                      />
                    </div>
                    <div className="tech-recommendation-footer-row">
                      <div className="tech-recommendation-footer">Мастер РЭС-7</div>
                      <button type="button" className="btn-primary btn-primary--large" onClick={handleSendForApproval}>
                        Отправить на согласование
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  )
}

function MasterListPage() {
  const location = useLocation()
  const [pendingIds, setPendingIds] = useState(() => {
    try {
      return Object.keys(sessionStorage)
        .filter((k) => k.startsWith('recommendation_'))
        .map((k) => k.replace('recommendation_', ''))
    } catch (_) {
      return []
    }
  })

  const refreshPending = () => {
    try {
      setPendingIds(
        Object.keys(sessionStorage)
          .filter((k) => k.startsWith('recommendation_'))
          .map((k) => k.replace('recommendation_', ''))
      )
    } catch (_) {}
  }

  const list = pendingIds.length > 0
    ? MOCK_APPLICATIONS.filter((a) => pendingIds.includes(a.number))
    : MOCK_APPLICATIONS.slice(0, 2)

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">Заявки</h1>
      </header>
      <div className="app-body">
        <aside className="sidebar">
          <nav className="sidebar-nav">
            <h2 className="sidebar-nav-title">На утверждении</h2>
            <p className="sidebar-nav-hint">Заявки с рекомендациями от инженера</p>
          </nav>
        </aside>
        <main className="main">
          <div className="main-toolbar">
            <div className="main-toolbar-left">
              <h2 className="main-title">Заявки на утверждении</h2>
              <nav className="cabinet-switcher" aria-label="Переключение кабинета">
                <Link to="/" className={`cabinet-switcher-link ${location.pathname === '/' ? 'cabinet-switcher-link--active' : ''}`}>
                  Оператор
                </Link>
                <Link to="/engineer" className={`cabinet-switcher-link ${location.pathname.startsWith('/engineer') ? 'cabinet-switcher-link--active' : ''}`}>
                  Инженер
                </Link>
                <Link to="/master" className={`cabinet-switcher-link ${location.pathname.startsWith('/master') ? 'cabinet-switcher-link--active' : ''}`}>
                  Мастер
                </Link>
              </nav>
            </div>
          </div>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th className="col-number">Номер</th>
                  <th className="col-applicant">Заявитель</th>
                  <th className="col-address">Адрес</th>
                  <th className="col-actions">Действия</th>
                </tr>
              </thead>
              <tbody>
                {list.map((row) => {
                  const hasPending = pendingIds.includes(row.number)
                  return (
                    <tr key={row.id}>
                      <td className="col-number">#{row.number}</td>
                      <td className="col-applicant">{row.applicant}</td>
                      <td className="col-address">{row.address}</td>
                      <td className="col-actions">
                        <div className="master-list-actions">
                          <Link
                            to={`/master/request/${row.number}/review`}
                            className="btn-primary"
                            onClick={refreshPending}
                          >
                            Рассмотреть
                            <CaretRightIcon />
                          </Link>
                          {hasPending && <span className="master-badge">Рекомендация отправлена</span>}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          {pendingIds.length === 0 && (
            <p className="master-empty-hint">Отправленные инженером рекомендации появятся здесь. Выберите «Инженер» → заявка → Сформировать рекомендации → Отправить.</p>
          )}
        </main>
      </div>
    </div>
  )
}

function MasterReviewPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [showEditBlock, setShowEditBlock] = useState(false)
  const [masterComment, setMasterComment] = useState('')
  const [masterDoc, setMasterDoc] = useState(() => getEmptyDoc())

  const recommendationData = (() => {
    try {
      const raw = sessionStorage.getItem(`recommendation_${id}`)
      return raw ? JSON.parse(raw) : null
    } catch (_) {
      return null
    }
  })()

  const selectedTp = recommendationData?.tp || null
  const comment = recommendationData?.comment || ''
  const savedDoc = recommendationData?.doc || null
  const allRows = getRecommendationsRows()
  const chosenRow = selectedTp ? allRows.find((r) => r.tpNumber === selectedTp) : null
  const backUrl = '/master'

  const openEditBlock = () => {
    setMasterDoc(savedDoc ? { ...getEmptyDoc(), ...savedDoc } : getEmptyDoc())
    setShowEditBlock(true)
  }

  const updateMasterDoc = (key, value) => setMasterDoc((prev) => ({ ...prev, [key]: value }))

  const handleApprove = () => {
    try {
      sessionStorage.setItem(
        `master_revision_${id}`,
        JSON.stringify({ tp: selectedTp, comment: masterComment, doc: masterDoc })
      )
      sessionStorage.removeItem(`recommendation_${id}`)
    } catch (_) {}
    navigate(backUrl)
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">Заявки</h1>
      </header>
      <div className="app-body">
        <aside className="sidebar">
          <nav className="sidebar-nav">
            <h2 className="sidebar-nav-title">На утверждении</h2>
          </nav>
        </aside>
        <main className="main request-detail-main master-review-page">
          <div className="main-toolbar">
            <div className="main-toolbar-left">
              <h2 className="main-title">Заявка №{id}. Утверждение рекомендации</h2>
              <nav className="cabinet-switcher" aria-label="Переключение кабинета">
                <Link to="/" className={`cabinet-switcher-link ${location.pathname === '/' ? 'cabinet-switcher-link--active' : ''}`}>
                  Оператор
                </Link>
                <Link to="/engineer" className={`cabinet-switcher-link ${location.pathname.startsWith('/engineer') ? 'cabinet-switcher-link--active' : ''}`}>
                  Инженер
                </Link>
                <Link to="/master" className={`cabinet-switcher-link ${location.pathname.startsWith('/master') ? 'cabinet-switcher-link--active' : ''}`}>
                  Мастер
                </Link>
              </nav>
            </div>
            <button type="button" className="btn-text" onClick={() => navigate(backUrl)}>
              Назад
            </button>
          </div>

          {!chosenRow ? (
            <p className="master-review-empty">Нет данных рекомендации для этой заявки. Вернитесь в список.</p>
          ) : (
            <>
              <section className="master-review-section">
                <h3 className="master-review-section-title">Варианты ТП (выбор инженера)</h3>
                <div className="master-review-tp-summary">
                  {MOCK_RECOMMENDED_TP.map((tp) => (
                    <div
                      key={tp.id}
                      className={`master-review-tp-chip ${tp.number === selectedTp ? 'master-review-tp-chip--chosen' : ''}`}
                    >
                      ТП {tp.number} — {tp.distance}, {tp.capacity}
                      {tp.number === selectedTp && <span className="master-review-tp-chip-badge">выбрано</span>}
                    </div>
                  ))}
                </div>
              </section>

              <section className="master-review-section">
                <h3 className="master-review-section-title">Данные по выбранной ТП</h3>
                <div className="master-review-card">
                  <dl className="master-review-key-value">
                    <div><dt>Номер ТП</dt><dd>{chosenRow.tpNumber}</dd></div>
                    <div><dt>Мощность</dt><dd>{chosenRow.power}</dd></div>
                    <div><dt>Номер ПС</dt><dd>{chosenRow.psNumber}</dd></div>
                    <div><dt>Класс напряжения</dt><dd>{chosenRow.voltageClass}</dd></div>
                    <div><dt>Балансовая принадлежность</dt><dd>{MOCK_TP_DETAIL.balanceOwnership}</dd></div>
                  </dl>
                </div>
              </section>

              <section className="master-review-section">
                <h3 className="master-review-section-title">Замеры Манат (Пик 1)</h3>
                <div className="zamery-manat-block">
                  <div className="zamery-manat-table-wrap">
                    <table className="zamery-manat-table">
                      <thead>
                        <tr>
                          <th className="zamery-manat-col-direction">Направление</th>
                          <th>IA</th>
                          <th>IB</th>
                          <th>IC</th>
                          <th>I0</th>
                        </tr>
                      </thead>
                      <tbody>
                        {MOCK_ZAMERY_MANAT[0].rows.slice(0, 5).map((row, i) => (
                          <tr key={i}>
                            <td className="zamery-manat-col-direction">{row.direction}</td>
                            <td>{row.ia || '—'}</td>
                            <td>{row.ib}</td>
                            <td>{row.ic}</td>
                            <td>{row.i0}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>

              <section className="master-review-section">
                <h3 className="master-review-section-title">Замеры Скада</h3>
                <div className="zamery-skada-list">
                  {MOCK_ZAMERY_SKADA.map((item, index) => (
                    <div key={index} className="zamery-skada-row">
                      <span className="zamery-skada-date">{item.date}</span>
                      <span className="zamery-skada-value">{item.value}</span>
                    </div>
                  ))}
                </div>
              </section>

              {savedDoc && (
                <section className="master-review-section">
                  <h3 className="master-review-section-title">Техническая рекомендация (от инженера)</h3>
                  <div className="tech-recommendation-doc tech-recommendation-doc--readonly">
                    <div className="tech-recommendation-table-wrap">
                      <table className="tech-recommendation-table">
                        <thead>
                          <tr>
                            <th>Потребитель</th>
                            <th>Целевое назначение объекта</th>
                            <th>Место расположения (адрес)</th>
                            <th>Запрашиваемая мощность</th>
                            <th>Категория эл.снабжения</th>
                            <th>Существующая мощность и точка подключения</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>{savedDoc.consumer || '—'}</td>
                            <td>{savedDoc.purpose || '—'}</td>
                            <td>{savedDoc.address || '—'}</td>
                            <td>{savedDoc.requestedPower || '—'}</td>
                            <td>{savedDoc.category || '—'}</td>
                            <td>{savedDoc.existingPower || '—'}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <h4 className="tech-recommendation-sub">Точка подключения от РУ-0,4кВ ТП (тип), КЯ, ЛЭП-0,4кВ</h4>
                    <div className="tech-recommendation-table-wrap">
                      <table className="tech-recommendation-table tech-recommendation-table-second">
                        <thead>
                          <tr>
                            <th>Точка подключения</th>
                            <th>Тип ТП</th>
                            <th colSpan={2}>Характеристика тр-ра Тр. №1</th>
                            <th colSpan={2}>Характеристика тр-ра Тр. №2</th>
                            <th colSpan={2}>Хар-ка ЛЭП</th>
                            <th colSpan={2}>Норм. схема</th>
                          </tr>
                          <tr>
                            <th></th>
                            <th></th>
                            <th>Imax (A)</th>
                            <th>S (kVA)</th>
                            <th>Imax (A)</th>
                            <th>S (kVA)</th>
                            <th>Год ввода</th>
                            <th>Нагр. Imax (A)</th>
                            <th>ПС</th>
                            <th>Фид</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>{savedDoc.connectionPoint || '—'}</td>
                            <td>{savedDoc.tpType || '—'}</td>
                            <td>{savedDoc.tr1Imax || '—'}</td>
                            <td>{savedDoc.tr1S || '—'}</td>
                            <td>{savedDoc.tr2Imax || '—'}</td>
                            <td>{savedDoc.tr2S || '—'}</td>
                            <td>{savedDoc.yearCommissioning || '—'}</td>
                            <td>{savedDoc.loadImax || '—'}</td>
                            <td>{savedDoc.ps || '—'}</td>
                            <td>{savedDoc.feeder || '—'}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <h4 className="tech-recommendation-sub">Условия для подключения, требования по усилению сетей.</h4>
                    <div className="master-review-conditions-readonly">{savedDoc.conditions || '—'}</div>
                  </div>
                </section>
              )}

              <section className="master-review-section">
                <h3 className="master-review-section-title">Коментарий инженера</h3>
                <div className="master-review-comment">{comment || (savedDoc?.engineerComment) || '—'}</div>
              </section>

              {showEditBlock && (
                <section className="master-review-section master-review-edit-block">
                  <h3 className="master-review-section-title">Редактирование рекомендации и утверждение</h3>
                  <div className="tech-recommendation-doc tech-recommendation-doc--editable">
                    <div className="tech-recommendation-table-wrap">
                      <table className="tech-recommendation-table">
                        <thead>
                          <tr>
                            <th>Потребитель</th>
                            <th>Целевое назначение объекта</th>
                            <th>Место расположения (адрес)</th>
                            <th>Запрашиваемая мощность</th>
                            <th>Категория эл.снабжения</th>
                            <th>Существующая мощность и точка подключения</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td><input type="text" className="tech-recommendation-input" value={masterDoc.consumer ?? ''} onChange={(e) => updateMasterDoc('consumer', e.target.value)} placeholder="—" /></td>
                            <td><input type="text" className="tech-recommendation-input" value={masterDoc.purpose ?? ''} onChange={(e) => updateMasterDoc('purpose', e.target.value)} placeholder="—" /></td>
                            <td><input type="text" className="tech-recommendation-input" value={masterDoc.address ?? ''} onChange={(e) => updateMasterDoc('address', e.target.value)} placeholder="—" /></td>
                            <td><input type="text" className="tech-recommendation-input" value={masterDoc.requestedPower ?? ''} onChange={(e) => updateMasterDoc('requestedPower', e.target.value)} placeholder="—" /></td>
                            <td><input type="text" className="tech-recommendation-input" value={masterDoc.category ?? ''} onChange={(e) => updateMasterDoc('category', e.target.value)} placeholder="—" /></td>
                            <td><input type="text" className="tech-recommendation-input" value={masterDoc.existingPower ?? ''} onChange={(e) => updateMasterDoc('existingPower', e.target.value)} placeholder="—" /></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <h4 className="tech-recommendation-sub">Точка подключения от РУ-0,4кВ ТП (тип), КЯ, ЛЭП-0,4кВ</h4>
                    <div className="tech-recommendation-table-wrap">
                      <table className="tech-recommendation-table tech-recommendation-table-second">
                        <thead>
                          <tr>
                            <th>Точка подключения</th>
                            <th>Тип ТП</th>
                            <th colSpan={2}>Характеристика тр-ра Тр. №1</th>
                            <th colSpan={2}>Характеристика тр-ра Тр. №2</th>
                            <th colSpan={2}>Хар-ка ЛЭП</th>
                            <th colSpan={2}>Норм. схема</th>
                          </tr>
                          <tr>
                            <th></th>
                            <th></th>
                            <th>Imax (A)</th>
                            <th>S (kVA)</th>
                            <th>Imax (A)</th>
                            <th>S (kVA)</th>
                            <th>Год ввода</th>
                            <th>Нагр. Imax (A)</th>
                            <th>ПС</th>
                            <th>Фид</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td><input type="text" className="tech-recommendation-input" value={masterDoc.connectionPoint ?? ''} onChange={(e) => updateMasterDoc('connectionPoint', e.target.value)} placeholder="—" /></td>
                            <td><input type="text" className="tech-recommendation-input" value={masterDoc.tpType ?? ''} onChange={(e) => updateMasterDoc('tpType', e.target.value)} placeholder="—" /></td>
                            <td><input type="text" className="tech-recommendation-input" value={masterDoc.tr1Imax ?? ''} onChange={(e) => updateMasterDoc('tr1Imax', e.target.value)} placeholder="—" /></td>
                            <td><input type="text" className="tech-recommendation-input" value={masterDoc.tr1S ?? ''} onChange={(e) => updateMasterDoc('tr1S', e.target.value)} placeholder="—" /></td>
                            <td><input type="text" className="tech-recommendation-input" value={masterDoc.tr2Imax ?? ''} onChange={(e) => updateMasterDoc('tr2Imax', e.target.value)} placeholder="—" /></td>
                            <td><input type="text" className="tech-recommendation-input" value={masterDoc.tr2S ?? ''} onChange={(e) => updateMasterDoc('tr2S', e.target.value)} placeholder="—" /></td>
                            <td><input type="text" className="tech-recommendation-input" value={masterDoc.yearCommissioning ?? ''} onChange={(e) => updateMasterDoc('yearCommissioning', e.target.value)} placeholder="—" /></td>
                            <td><input type="text" className="tech-recommendation-input" value={masterDoc.loadImax ?? ''} onChange={(e) => updateMasterDoc('loadImax', e.target.value)} placeholder="—" /></td>
                            <td><input type="text" className="tech-recommendation-input" value={masterDoc.ps ?? ''} onChange={(e) => updateMasterDoc('ps', e.target.value)} placeholder="—" /></td>
                            <td><input type="text" className="tech-recommendation-input" value={masterDoc.feeder ?? ''} onChange={(e) => updateMasterDoc('feeder', e.target.value)} placeholder="—" /></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <h4 className="tech-recommendation-sub">Условия для подключения, требования по усилению сетей.</h4>
                    <textarea
                      className="tech-recommendation-conditions-input"
                      value={masterDoc.conditions ?? ''}
                      onChange={(e) => updateMasterDoc('conditions', e.target.value)}
                      placeholder="Условия..."
                      rows={4}
                    />
                  </div>
                  <h3 className="master-review-section-title">Коментарий Мастера</h3>
                  <textarea
                    className="recommendations-comment-input"
                    placeholder="Заключение мастера, замечания или указания для доработки..."
                    value={masterComment}
                    onChange={(e) => setMasterComment(e.target.value)}
                    rows={4}
                  />
                  <div className="master-review-edit-actions">
                    <button type="button" className="btn-outline" onClick={() => { setShowEditBlock(false); setMasterComment('') }}>
                      Отмена
                    </button>
                    <button type="button" className="btn-primary btn-primary--large" onClick={handleApprove}>
                      Утвердить
                    </button>
                  </div>
                </section>
              )}

              <div className="master-review-actions">
                <Link to={`/engineer/request/${id}/tp/${selectedTp}`} className="btn-outline" target="_blank" rel="noopener noreferrer">
                  Подробнее
                </Link>
                {!showEditBlock && (
                  <div className="master-review-buttons">
                    <button type="button" className="btn-secondary" onClick={openEditBlock}>
                      Редактировать
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  )
}

function TuProjectPage() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const location = useLocation()
  const tpFromUrl = searchParams.get('tp') || ''
  const request = MOCK_APPLICATIONS.find((r) => r.number === id)
  const backUrl = `/engineer/request/${id}/recommendations${tpFromUrl ? `?tp=${tpFromUrl}` : ''}`

  const [tuFields, setTuFields] = useState({
    applicant: request?.applicant || '',
    address: request?.address || '',
    tp: tpFromUrl,
    power: '100 кВА',
    deadline: '30.06.2026',
  })

  const updateField = (key, value) => setTuFields((prev) => ({ ...prev, [key]: value }))

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">Заявки</h1>
      </header>
      <div className="app-body">
        <RequestDetailSidebar />
        <main className="main request-detail-main tu-project-page">
          <div className="main-toolbar">
            <div className="main-toolbar-left">
              <h2 className="main-title">Проект ТУ</h2>
              <nav className="cabinet-switcher" aria-label="Переключение кабинета">
                <Link to="/" className={`cabinet-switcher-link ${location.pathname === '/' ? 'cabinet-switcher-link--active' : ''}`}>
                  Оператор
                </Link>
                <Link to="/engineer" className={`cabinet-switcher-link ${location.pathname.startsWith('/engineer') ? 'cabinet-switcher-link--active' : ''}`}>
                  Инженер
                </Link>
                <Link to="/master" className={`cabinet-switcher-link ${location.pathname.startsWith('/master') ? 'cabinet-switcher-link--active' : ''}`}>
                  Мастер
                </Link>
              </nav>
            </div>
            <button type="button" className="btn-text" onClick={() => navigate(backUrl)}>
              Назад
            </button>
          </div>

          <div className="tu-project-card">
            <h3 className="tu-project-doc-title">Технические условия на подключение к электрическим сетям</h3>

            <div className="tu-project-fields">
              <div className="tu-project-field">
                <label className="tu-project-label">Заявка №</label>
                <span className="tu-project-value">{id}</span>
              </div>
              <div className="tu-project-field">
                <label className="tu-project-label">Заявитель</label>
                <input
                  type="text"
                  className="tu-project-input"
                  value={tuFields.applicant}
                  onChange={(e) => updateField('applicant', e.target.value)}
                  placeholder="Наименование заявителя"
                />
              </div>
              <div className="tu-project-field">
                <label className="tu-project-label">Адрес объекта</label>
                <input
                  type="text"
                  className="tu-project-input"
                  value={tuFields.address}
                  onChange={(e) => updateField('address', e.target.value)}
                  placeholder="Адрес объекта"
                />
              </div>
              <div className="tu-project-field">
                <label className="tu-project-label">Рекомендуемая ТП</label>
                <input
                  type="text"
                  className="tu-project-input"
                  value={tuFields.tp}
                  onChange={(e) => updateField('tp', e.target.value)}
                  placeholder="Номер ТП"
                />
              </div>
              <div className="tu-project-field">
                <label className="tu-project-label">Мощность присоединения, кВА</label>
                <input
                  type="text"
                  className="tu-project-input tu-project-input--short"
                  value={tuFields.power}
                  onChange={(e) => updateField('power', e.target.value)}
                  placeholder="кВА"
                />
              </div>
              <div className="tu-project-field">
                <label className="tu-project-label">Срок выполнения работ</label>
                <input
                  type="text"
                  className="tu-project-input tu-project-input--short"
                  value={tuFields.deadline}
                  onChange={(e) => updateField('deadline', e.target.value)}
                  placeholder="ДД.ММ.ГГГГ"
                />
              </div>
            </div>

            <div className="tu-project-template">
              <p>В соответствии с заявкой на технологическое присоединение к электрическим сетям, на основании проведённого расчёта и выбранного варианта присоединения устанавливаются следующие технические условия.</p>
              <p>Присоединение осуществляется к трансформаторной подстанции <strong>ТП {tuFields.tp || '______'}</strong>. Заявленная мощность присоединения — <strong>{tuFields.power || '______'}</strong>. Срок выполнения работ по подключению — до <strong>{tuFields.deadline || '______'}</strong>.</p>
              <p>Выполнение работ производится в соответствии с действующими нормами и правилами. После выполнения работ заявитель уведомляет сетевую организацию для проведения осмотра и допуска.</p>
            </div>

            <div className="tu-project-footer">
              <button type="button" className="btn-primary btn-primary--large">
                Отправить на подпись
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<OperatorList />} />
      <Route path="/engineer" element={<OperatorList />} />
      <Route path="/request/:id" element={<RequestDetail />} />
      <Route path="/engineer/request/:id" element={<EngineerRequestDetail />} />
      <Route path="/engineer/request/:id/tp/:tpNumber" element={<TpDetailPage />} />
      <Route path="/engineer/request/:id/recommendations" element={<RecommendationsPage />} />
      <Route path="/engineer/request/:id/tu" element={<TuProjectPage />} />
      <Route path="/master" element={<MasterListPage />} />
      <Route path="/master/request/:id/review" element={<MasterReviewPage />} />
    </Routes>
  )
}
