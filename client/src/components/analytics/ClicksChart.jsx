import { format } from "date-fns";
import { useMemo } from "react";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";



const ClicksChart = ({ links }) => {
    // Imports needed: React, hooks, recharts, date-fns
    const clicksOverTimeData = useMemo(() => {
        const clicksByDate = {};
        if (!Array.isArray(links)) return [];

        links.forEach(link => {
            if (Array.isArray(link?.rawAnalytics)) {
                link.rawAnalytics.forEach(click => {
                    if (click?.timestamp) {
                        try {
                            const date = format(new Date(click.timestamp), 'yyyy-MM-dd');
                            clicksByDate[date] = (clicksByDate[date] || 0) + 1;
                        } catch (e) {
                            console.error("Error formatting date:", click.timestamp, e);
                        }
                    }
                });
            }
        });
        return Object.entries(clicksByDate)
            .map(([date, clicks]) => ({ date, clicks }))
            .sort((a, b) => new Date(a.date) - new Date(b.date));
    }, [links]);

    if (clicksOverTimeData.length === 0) {
        return <div className="text-center text-gray-500 py-8">No click data available for charts.</div>;
    }

    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={clicksOverTimeData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                <YAxis allowDecimals={false} stroke="#6b7280" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '4px' }} />
                <Legend wrapperStyle={{ fontSize: '14px' }} />
                <Line type="monotone" dataKey="clicks" stroke="#3b82f6" strokeWidth={2} activeDot={{ r: 6 }} dot={{ r: 3 }} name="Total Clicks per Day" />
            </LineChart>
        </ResponsiveContainer>
    );
};


export default ClicksChart