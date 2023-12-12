import React from 'react'
import historyTableData from '@/utils/historytableData';
import TestTable from './TestTable';
import PrescriptionTable from './PrescriptionTable';

const HistoryTable = () => {
  return (
    <div className='mt-[1.5rem]'>
        <h3 className='text-[1.25rem] font-medium text-[#151515]'>History</h3>
        <table className='w-full mt-[1rem] text-[#151515]'>
            <thead>
                <tr className='text-left text-[0.875rem]'>
                    <th className='font-normal py-[0.88rem]'>Symptoms</th>
                    <th className='font-normal py-[0.88rem]'>Treatment</th>
                    <th className='font-normal py-[0.88rem]'>Prescription</th>
                    <th className='font-normal py-[0.88rem]'>Patients</th>
                    <th className='font-normal py-[0.88rem]'>Date</th>
                    <th className='font-normal py-[0.88rem]'>Status</th>
                </tr>
            </thead>
            <tbody>
                {historyTableData.map((item) => (
                    <tr key={item.id} className='text-[0.75rem]'>
                        <td className='py-[0.875rem]'>{item.Symptoms}</td>
                        <td className='py-[0.875rem]'>{item.treatment}</td>
                        <td className='py-[0.875rem]'>{item.prescription}</td>
                        <td className='py-[0.875rem]'>{item.patient}</td>
                        <td className='py-[0.875rem]'>{item.date}</td>
                        <td className='py-[0.875rem]'>{item.status}</td>
                    </tr>
                ))}
            </tbody>
        </table>
        <div className='col-span-full grid grid-cols-12 gap-[2rem]'>
            <div className='col-span-7'>
                <TestTable />
            </div>
            <div className='col-span-5'>
                <PrescriptionTable />
            </div>
        </div>
        
    </div>
  )
}

export default HistoryTable