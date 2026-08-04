export default function SizeGuidePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-extrabold tracking-tight mb-4">Size Guide</h1>
      <p className="text-muted-foreground mb-8">All measurements are listed in inches.</p>
      <div className="overflow-x-auto border border-border rounded-lg bg-card shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-surface text-xs uppercase tracking-wider">
            <tr>
              <th className="p-4">Size</th>
              <th className="p-4">Chest</th>
              <th className="p-4">Length</th>
              <th className="p-4">Shoulder</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            <tr><td className="p-4 font-bold">S</td><td className="p-4">38 - 40</td><td className="p-4">27</td><td className="p-4">18</td></tr>
            <tr><td className="p-4 font-bold">M</td><td className="p-4">40 - 42</td><td className="p-4">28</td><td className="p-4">19</td></tr>
            <tr><td className="p-4 font-bold">L</td><td className="p-4">42 - 44</td><td className="p-4">29</td><td className="p-4">20</td></tr>
            <tr><td className="p-4 font-bold">XL</td><td className="p-4">44 - 46</td><td className="p-4">30</td><td className="p-4">21</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
