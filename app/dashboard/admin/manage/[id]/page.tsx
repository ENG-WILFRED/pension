///home/hp/JERE/pension/app/dashboard/admin/manage/[id]/page.tsx
"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function MemberDetail({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const [member, setMember] = useState<any | null>(null);

  useEffect(() => {
    // load from mocked seed (in real app we'd fetch)
    const seed = [
      { id: '1', name: 'Wilfred Kimani', email: 'kimaniwilfred95@gmail.com', joinDate: '2024-12-21', status: 'active', contribution: 33000, balance: 548000 },
      { id: '2', name: 'Grace Ouma', email: 'grace.ouma@example.com', joinDate: '2024-12-19', status: 'active', contribution: 25000, balance: 425000 },
      { id: '3', name: 'James Kipchoge', email: 'james.kipchoge@example.com', joinDate: '2024-12-18', status: 'suspended', contribution: 18000, balance: 285000 },
    ];
    const found = seed.find(s => s.id === id) || null;
    setMember(found);
  }, [id]);

  const toggle = () => {
    if (!member) return;
    const next = member.status === 'active' ? 'suspended' : 'active';
    setMember({ ...member, status: next });
    toast.success(`${member.name} is now ${next}`);
  };

  if (!member) return <div className="p-8">Member not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-6 rounded shadow">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold">{member.name}</h2>
              <p className="text-sm text-gray-600">{member.email}</p>
            </div>
            <div>
              <button onClick={() => router.back()} className="text-sm text-blue-600">← Back</button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Joined</p>
              <p className="font-medium">{member.joinDate}</p>

              <p className="mt-4 text-sm text-gray-500">Contribution</p>
              <p className="font-medium">KSH {member.contribution.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Balance</p>
              <p className="font-medium">KSH {member.balance.toLocaleString()}</p>

              <p className="mt-4 text-sm text-gray-500">Status</p>
              <p className={`inline-block px-2 py-1 rounded ${member.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{member.status}</p>
            </div>
          </div>

          <div className="mt-6 flex gap-2">
            <button onClick={toggle} className="px-4 py-2 bg-red-600 text-white rounded">{member.status === 'active' ? 'Disable Member' : 'Enable Member'}</button>
            <button onClick={() => toast('Sent message to member') } className="px-4 py-2 bg-gray-200 rounded">Message</button>
          </div>
        </div>
      </div>
    </div>
  );
}
