// @ts-nocheck
import React, { useState } from 'react'
import usePostHook from '../../../hook/usePost';
import { toast } from 'react-toastify';

const ConfirmDuesPayment = ({item, close, refetch}) => {
    const [loading, setLoading] = useState(false);
    const onSuccess = () => {
        setLoading(false);
        refetch();
        toast.success("Dues payment updated successfully");
        close();
      };
      const {handlePost} = usePostHook()
      const handleUpdate = () => {
        setLoading(true);
        const fd = new FormData();
        fd.append("transaction_id", item.id);
        fd.append("status", 'success');
        handlePost(
          `admin/dues/update/transaction`,
          fd,
          `application/json`,
          onSuccess
        );
      };
  return (
    <>
        <div>
            <a href={item.receipt} target="_blank" rel="noopener noreferrer"><img src={item.receipt} alt="receipt" className='w-full' /></a>
            <div className='mt-4'>
                <button className='bg-blue-900 py-2 rounded-lg font-semibold w-full text-white' onClick={handleUpdate}>{loading? "Confirming..." : "Confirm Payment"}</button>
            </div>
        </div>
    </>
  )
}

export default ConfirmDuesPayment