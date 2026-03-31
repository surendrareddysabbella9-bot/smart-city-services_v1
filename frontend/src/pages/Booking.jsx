import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { FaCalendarAlt, FaClipboardList, FaCheckCircle, FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../services/api';

function Booking() {
  const { workerId } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ description: '', start_time: '', end_time: '' });

  const { data: worker, isLoading } = useQuery({
    queryKey: ['worker', workerId],
    queryFn: () => api.get(`/workers/${workerId}`).then(res => res.data.data || res.data)
  });

  const handleSubmit = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    try {
      await api.post('/bookings', {
        customer_id: user.customerId || user.id,
        worker_id: workerId,
        description: form.description,
        start_time: form.start_time,
        end_time: form.end_time
      });
      toast.success('Your service logic has been securely locked and successfully booked!');
      navigate('/dashboard/customer');
    } catch (err) {
      if (err.response?.status === 409) {
        toast.error('Schedule Conflict Block: Time slot dynamically occupied securely.');
      } else {
        toast.error(err.response?.data?.error || 'Failed to initialize booking boundary.');
      }
    }
  };

  if (isLoading) return <div className="container" style={{ textAlign: 'center', padding: '4rem', fontSize: '1.25rem', color: 'var(--text-light)' }}>Pulling intelligence ledgers...</div>;

  return (
    <div className="container" style={{ maxWidth: '700px' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Secure Reservation Boundary Framework</h1>
        <p style={{ color: 'var(--text-light)' }}>Executing targeted contract logic for <strong style={{ color: 'var(--text)' }}>{worker?.name}</strong> • {worker?.category}</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2.5rem', padding: '0 2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: step >= 1 ? 1 : 0.4 }}>
          <div style={{ width: '40px', height: '40px', background: step >= 1 ? 'var(--primary)' : 'var(--background)', color: step >= 1 ? 'white' : 'var(--text-light)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.5rem', fontWeight: 'bold' }}>1</div>
          <span style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Interval Sync</span>
        </div>
        <div style={{ flex: 1, height: '4px', background: step >= 2 ? 'var(--primary)' : 'var(--border)', margin: '18px 1rem 0 1rem', borderRadius: '2px' }}></div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: step >= 2 ? 1 : 0.4 }}>
          <div style={{ width: '40px', height: '40px', background: step >= 2 ? 'var(--primary)' : 'var(--background)', color: step >= 2 ? 'white' : 'var(--text-light)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.5rem', fontWeight: 'bold' }}>2</div>
          <span style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Project Vector</span>
        </div>
        <div style={{ flex: 1, height: '4px', background: step >= 3 ? 'var(--primary)' : 'var(--border)', margin: '18px 1rem 0 1rem', borderRadius: '2px' }}></div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: step >= 3 ? 1 : 0.4 }}>
          <div style={{ width: '40px', height: '40px', background: step >= 3 ? 'var(--primary)' : 'var(--background)', color: step >= 3 ? 'white' : 'var(--text-light)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.5rem', fontWeight: 'bold' }}>3</div>
          <span style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Verification Hash</span>
        </div>
      </div>

      <div className="card" style={{ padding: '2.5rem', borderTop: '4px solid var(--primary)', borderRadius: '8px' }}>
        {step === 1 && (
          <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}><FaCalendarAlt color="var(--primary)" /> Select Resource Schedule Limits</h3>
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label>Service Initiation Target (Start)</label>
              <input type="datetime-local" value={form.start_time} onChange={e=>setForm({...form, start_time: e.target.value})} style={{ padding: '0.75rem', fontSize: '1rem', border: '1px solid var(--border)', borderRadius: '4px' }} />
            </div>
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label>Service Conclusion Target (End)</label>
              <input type="datetime-local" value={form.end_time} onChange={e=>setForm({...form, end_time: e.target.value})} style={{ padding: '0.75rem', fontSize: '1rem', border: '1px solid var(--border)', borderRadius: '4px' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2.5rem' }}>
              <button disabled={!form.start_time || !form.end_time} className="btn" onClick={() => setStep(2)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>Validate Temporal Limits <FaArrowRight /></button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}><FaClipboardList color="var(--primary)" /> Project Operational Definition</h3>
            <div className="form-group">
              <label>Explicit Task Breakdown Ledger</label>
              <textarea rows="5" placeholder="Specify exactly what physical configurations need intervention..." value={form.description} onChange={e=>setForm({...form, description: e.target.value})} style={{ padding: '1rem', fontSize: '1rem', border: '1px solid var(--border)', borderRadius: '4px' }}></textarea>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2.5rem' }}>
              <button className="btn btn-secondary" onClick={() => setStep(1)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FaArrowLeft /> Retract to Limits</button>
              <button disabled={!form.description} className="btn" onClick={() => setStep(3)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>Verify Payload Data <FaArrowRight /></button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={{ animation: 'fadeIn 0.3s ease-out', textAlign: 'center' }}>
            <FaCheckCircle color="#10b981" size={72} style={{ marginBottom: '1.5rem' }} />
            <h3 style={{ marginBottom: '2rem' }}>Final Contract Cryptographic Review</h3>
            
            <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '8px', textAlign: 'left', marginBottom: '2.5rem', border: '1px solid var(--border)' }}>
               <p style={{ margin: '0 0 0.75rem 0' }}><strong style={{ color: 'var(--text-light)', minWidth: '120px', display: 'inline-block' }}>Target Hash:</strong> {worker?.name} ({worker?.category})</p>
               <p style={{ margin: '0 0 0.75rem 0' }}><strong style={{ color: 'var(--text-light)', minWidth: '120px', display: 'inline-block' }}>Lock In Start:</strong> {new Date(form.start_time).toLocaleString()}</p>
               <p style={{ margin: '0 0 0.75rem 0' }}><strong style={{ color: 'var(--text-light)', minWidth: '120px', display: 'inline-block' }}>Lock In End:</strong> {new Date(form.end_time).toLocaleString()}</p>
               <p style={{ margin: '0 0 0.75rem 0' }}><strong style={{ color: 'var(--text-light)', minWidth: '120px', display: 'inline-block' }}>Scope Array:</strong> {form.description}</p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button className="btn btn-secondary" onClick={() => setStep(2)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FaArrowLeft /> Update Parameters</button>
              <button className="btn" onClick={handleSubmit} style={{ background: '#10b981', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold' }}>Lock Execution Logic <FaCheckCircle /></button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default Booking;
