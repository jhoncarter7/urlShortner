import { ResponsiveContainer, PieChart, Pie, Tooltip, Legend, Cell, } from 'recharts';
import { useMemo } from 'react';
import { UAParser } from 'ua-parser-js';

const DeviceChart = ({ links }) => {
    // Imports needed: React, hooks, recharts, ua-parser-js
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d'];

    const deviceData = useMemo(() => {
        const parser = new UAParser();
        const browsers = {};
        const os = {};
        let totalClicks = 0;
         if (!Array.isArray(links)) return { browserChartData: [], osChartData: [], totalClicks: 0 };

        links.forEach(link => {
            if (Array.isArray(link?.rawAnalytics)) {
                link.rawAnalytics.forEach(click => {
                    totalClicks++;
                    try {
                        const ua = parser.setUA(click?.userAgent || '').getResult();
                        const browserName = ua.browser.name || 'Unknown';
                        const osName = ua.os.name || 'Unknown';
                        browsers[browserName] = (browsers[browserName] || 0) + 1;
                        os[osName] = (os[osName] || 0) + 1;
                    } catch (e) {
                         console.error("Error parsing User Agent:", click?.userAgent, e);
                         browsers['Unknown'] = (browsers['Unknown'] || 0) + 1;
                         os['Unknown'] = (os['Unknown'] || 0) + 1;
                    }
                });
            }
        });

        const browserChartData = Object.entries(browsers)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value);

        const osChartData = Object.entries(os)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value);

        return { browserChartData, osChartData, totalClicks };
    }, [links]);

     if (deviceData.totalClicks === 0) {
         return null;
     }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
                <h4 className="text-md font-semibold mb-4 text-center text-gray-700">Clicks by Browser</h4>
                <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                        <Pie
                            data={deviceData.browserChartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            nameKey="name"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            fontSize={12}
                        >
                            {deviceData.browserChartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                         <Tooltip formatter={(value) => `${value} clicks`} />
                         <Legend wrapperStyle={{ fontSize: '12px' }} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
             <div>
                <h4 className="text-md font-semibold mb-4 text-center text-gray-700">Clicks by Operating System</h4>
                <ResponsiveContainer width="100%" height={250}>
                     <PieChart>
                        <Pie
                            data={deviceData.osChartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#82ca9d"
                            dataKey="value"
                            nameKey="name"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                             fontSize={12}
                        >
                            {deviceData.osChartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                         <Tooltip formatter={(value) => `${value} clicks`} />
                         <Legend wrapperStyle={{ fontSize: '12px' }} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};


export default DeviceChart;