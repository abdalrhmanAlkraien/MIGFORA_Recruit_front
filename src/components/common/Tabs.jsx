import './styles/Tabs.css'

/**
 * Tabs
 *
 * Props:
 *   tabs      — array of { key: string, label: string, count?: number }
 *   activeTab — string key of the active tab
 *   onChange  — function(key) called on tab click
 *
 * Usage:
 *   const TABS = [
 *     { key: 'overview',  label: 'Overview'  },
 *     { key: 'findings',  label: 'Findings',  count: 12 },
 *     { key: 'report',    label: 'Report'    },
 *   ]
 *   <Tabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />
 *   {activeTab === 'overview' && <Overview />}
 *   {activeTab === 'findings' && <Findings />}
 */
function Tabs({ tabs, activeTab, onChange }) {
  return (
    <div className="tabs" role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          role="tab"
          aria-selected={activeTab === tab.key}
          className={`tabs__tab ${activeTab === tab.key ? 'tabs__tab--active' : ''}`}
          onClick={() => onChange(tab.key)}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span className={`tabs__count ${activeTab === tab.key ? 'tabs__count--active' : ''}`}>
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}

export default Tabs