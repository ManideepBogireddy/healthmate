import React, { useState, useEffect, useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

/**
 * Reusable Bar Chart component with Date Range Filtering
 * @param {Object} props
 * @param {Array} props.data - Array of data objects
 * @param {String} props.dateKey - Key for the date field in data objects (default 'date')
 * @param {Array} props.metrics - Array of metric objects { key, label, color }
 * @param {String} props.title - Chart title
 * @param {Boolean} props.stacked - Whether to stack bars
 */
const ChartComponent = ({
    data = [],
    dateKey = 'date',
    metrics = [],
    title = 'Progress Overview',
    stacked = false
}) => {
    const [startDate, setStartDate] = useState(() => {
        const d = new Date();
        d.setDate(d.getDate() - 7);
        return d.toISOString().split('T')[0];
    });
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
    const [isLightMode, setIsLightMode] = useState(document.body.classList.contains('light-mode'));

    // Detect theme changes to update chart colors
    useEffect(() => {
        const observer = new MutationObserver(() => {
            setIsLightMode(document.body.classList.contains('light-mode'));
        });
        observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
        return () => observer.disconnect();
    }, []);

    // Theme-based colors
    const colors = {
        grid: isLightMode ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.05)',
        text: isLightMode ? '#475569' : '#94a3b8', // text-muted equivalent
        mainText: isLightMode ? '#0f172a' : '#f8fafc', // text-main equivalent
        tooltipBg: isLightMode ? 'rgba(255, 255, 255, 0.95)' : 'rgba(15, 23, 42, 0.95)',
        tooltipBorder: isLightMode ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)',
        tooltipTitle: isLightMode ? '#0f172a' : '#f8fafc',
        tooltipBody: isLightMode ? '#475569' : '#cbd5e1'
    };

    const filteredAndSortedData = useMemo(() => {
        return data
            .filter(item => {
                if (!item[dateKey]) return false;
                const itemDate = typeof item[dateKey] === 'string' ? item[dateKey].split('T')[0] : '';
                return itemDate >= startDate && itemDate <= endDate;
            })
            .sort((a, b) => new Date(a[dateKey]) - new Date(b[dateKey]));
    }, [data, dateKey, startDate, endDate]);

    const chartData = {
        labels: filteredAndSortedData.map(item => {
            const date = new Date(item[dateKey]);
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }),
        datasets: metrics.map(metric => ({
            label: metric.label,
            data: filteredAndSortedData.map(item => item[metric.key] || 0),
            backgroundColor: metric.color || 'var(--primary-color)',
            borderRadius: 6,
            borderSkipped: false,
        }))
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
            padding: {
                top: 20,
                bottom: 10
            }
        },
        scales: {
            x: {
                stacked: stacked,
                grid: {
                    display: false
                },
                ticks: {
                    color: colors.text,
                    font: {
                        family: "'Outfit', sans-serif",
                        size: 11
                    },
                    padding: 10
                }
            },
            y: {
                stacked: stacked,
                beginAtZero: true,
                grid: {
                    color: colors.grid,
                    drawBorder: false
                },
                ticks: {
                    color: colors.text,
                    font: {
                        family: "'Outfit', sans-serif",
                        size: 11
                    },
                    padding: 10
                }
            }
        },
        plugins: {
            legend: {
                position: 'top',
                align: 'end',
                labels: {
                    color: colors.mainText,
                    boxWidth: 12,
                    boxHeight: 12,
                    usePointStyle: true,
                    padding: 20,
                    font: {
                        family: "'Outfit', sans-serif",
                        size: 12,
                        weight: '500'
                    }
                }
            },
            tooltip: {
                backgroundColor: colors.tooltipBg,
                titleColor: colors.tooltipTitle,
                bodyColor: colors.tooltipBody,
                padding: 12,
                borderRadius: 12,
                borderColor: colors.tooltipBorder,
                borderWidth: 1,
                bodyFont: {
                    family: "'Outfit', sans-serif"
                },
                titleFont: {
                    family: "'Outfit', sans-serif",
                    weight: 'bold'
                },
                callbacks: {
                    label: function (context) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            label += context.parsed.y;
                        }
                        return label;
                    }
                }
            }
        },
        barPercentage: 0.7,
        categoryPercentage: 0.8
    };

    return (
        <div className="glass-card" style={{ padding: '25px', height: '400px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '15px' }}>
                <h3 style={{ margin: 0, color: colors.mainText, fontSize: '1.2rem' }}>{title}</h3>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.03)', padding: '6px 12px', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.75rem', color: colors.text, fontWeight: '600', textTransform: 'uppercase' }}>From</span>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--primary)',
                                fontSize: '0.85rem',
                                fontWeight: '700',
                                outline: 'none',
                                cursor: 'pointer'
                            }}
                        />
                    </div>
                    <div style={{ width: '1px', height: '15px', background: 'var(--glass-border)' }}></div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.75rem', color: colors.text, fontWeight: '600', textTransform: 'uppercase' }}>To</span>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--primary)',
                                fontSize: '0.85rem',
                                fontWeight: '700',
                                outline: 'none',
                                cursor: 'pointer'
                            }}
                        />
                    </div>
                </div>
            </div>

            <div style={{ flex: 1, minHeight: '300px' }}>
                {filteredAndSortedData.length > 0 ? (
                    <Bar data={chartData} options={options} />
                ) : (
                    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', textAlign: 'center' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '15px', opacity: 0.5 }}>📊</div>
                        <p style={{ margin: 0, fontWeight: '500' }}>No data available for the selected range.</p>
                        <p style={{ fontSize: '0.8rem', marginTop: '5px' }}>Try selecting a wider date range or logging new stats!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChartComponent;
