import { useSelector } from 'react-redux'
import { Users, UserCheck, UserX, Building2 } from 'lucide-react'
import {
  AreaChart as ReAreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts'
import KPICard from '../components/ui/KPICard'
import { KPICardSkeleton, TableRowSkeleton } from '../components/ui/SkeletonLoader'
import Badge from '../components/ui/Badge'

const headcountData = [
  { month: 'Aug', count: 72 },
  { month: 'Sep', count: 78 },
  { month: 'Oct', count: 80 },
  { month: 'Nov', count: 76 },
  { month: 'Dec', count: 82 },
  { month: 'Jan', count: 85 },
  { month: 'Feb', count: 90 },
  { month: 'Mar', count: 94 },
]

const deptData = [
  { dept: 'Eng',     count: 34 },
  { dept: 'Product', count: 12 },
  { dept: 'Design',  count: 10 },
  { dept: 'HR',      count: 8  },
  { dept: 'Finance', count: 9  },
  { dept: 'Marketing', count: 11 },
  { dept: 'Other',   count: 10 },
]

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white dark:bg-surface-800 border border-surface-100 dark:border-surface-700 rounded-xl px-3 py-2 shadow-lg">
      <p className="text-xs text-surface-500 dark:text-surface-400">{label}</p>
      <p className="text-sm font-semibold text-surface-900 dark:text-white">{payload[0].value}</p>
    </div>
  )
}

export default function Dashboard() {
  const employees   = useSelector(s => s.employee.list)
  const loading     = useSelector(s => s.employee.loading)
  const total       = employees.length
  const active      = employees.filter(e => e.status === 'Active').length
  const onLeave     = employees.filter(e => e.status === 'On Leave').length
  const departments = [...new Set(employees.map(e => e.department))].length
  const recent      = employees.slice(-5).reverse()

  return (
    <div className="space-y-6 animate-fade-in">

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <KPICardSkeleton key={i} />)
        ) : (
          <>
            <KPICard title="Total Employees" value={total}       change={12}  icon={Users}     color="brand"   />
            <KPICard title="Active"          value={active}      change={8}   icon={UserCheck} color="emerald" />
            <KPICard title="On Leave"        value={onLeave}     change={-2}  icon={UserX}     color="amber"   />
            <KPICard title="Departments"     value={departments} change={0}   icon={Building2} color="brand"   />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-semibold text-surface-900 dark:text-white">Headcount Trend</h3>
              <p className="text-xs text-surface-400 dark:text-surface-500 mt-0.5">Last 8 months</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <ReAreaChart data={headcountData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}    />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-surface-100 dark:text-surface-700" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={2}
                fill="url(#colorCount)"
                dot={{ fill: '#6366f1', r: 3, strokeWidth: 0 }}
                activeDot={{ r: 5, strokeWidth: 0 }}
              />
            </ReAreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <h3 className="text-sm font-semibold text-surface-900 dark:text-white mb-1">By Department</h3>
          <p className="text-xs text-surface-400 dark:text-surface-500 mb-5">Current headcount</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={deptData} margin={{ top: 0, right: 0, left: -24, bottom: 0 }} barSize={8}>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-surface-100 dark:text-surface-700" />
              <XAxis dataKey="dept" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-surface-100 dark:border-surface-800">
          <h3 className="text-sm font-semibold text-surface-900 dark:text-white">Recent Employees</h3>
        </div>

        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-50 dark:border-surface-800">
                {['Employee', 'Department', 'Role', 'Location', 'Status'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-surface-400 dark:text-surface-500 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-50 dark:divide-surface-800">
              {loading
                ? Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} cols={5} />)
                : recent.map(emp => (
                    <tr key={emp.id} className="hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900/40 flex items-center justify-center text-brand-600 dark:text-brand-400 text-xs font-semibold flex-shrink-0">
                            {emp.firstName[0]}{emp.lastName[0]}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-surface-900 dark:text-surface-100">{emp.firstName} {emp.lastName}</p>
                            <p className="text-xs text-surface-400 font-mono">{emp.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-surface-600 dark:text-surface-300">{emp.department}</td>
                      <td className="px-5 py-3.5 text-sm text-surface-600 dark:text-surface-300">{emp.jobTitle}</td>
                      <td className="px-5 py-3.5 text-sm text-surface-600 dark:text-surface-300">{emp.workLocation}</td>
                      <td className="px-5 py-3.5"><Badge text={emp.status} /></td>
                    </tr>
                  ))
              }
            </tbody>
          </table>
        </div>

        <div className="md:hidden divide-y divide-surface-50 dark:divide-surface-800">
          {loading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-surface-100 dark:bg-surface-700 animate-pulse flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-32 bg-surface-100 dark:bg-surface-700 rounded-xl animate-pulse" />
                    <div className="h-3 w-24 bg-surface-100 dark:bg-surface-700 rounded-xl animate-pulse" />
                  </div>
                </div>
              ))
            : recent.map(emp => (
                <div key={emp.id} className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-900/40 flex items-center justify-center text-brand-600 dark:text-brand-400 text-sm font-semibold flex-shrink-0">
                    {emp.firstName[0]}{emp.lastName[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-surface-900 dark:text-surface-100">{emp.firstName} {emp.lastName}</p>
                    <p className="text-xs text-surface-500 dark:text-surface-400">{emp.department} · {emp.jobTitle}</p>
                  </div>
                  <Badge text={emp.status} />
                </div>
              ))
          }
        </div>
      </div>
    </div>
  )
}