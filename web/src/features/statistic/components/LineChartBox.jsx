import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from "recharts";

export default function LineChartBox({ title, data, dataKeys }) {
  return (
    <div className="bg-white shadow rounded-xl p-4">
      <h3 className="font-semibold text-gray-700 mb-2">{title}</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          {dataKeys.map(({ key, color }) => (
            <Line key={key} type="monotone" dataKey={key} stroke={color} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
