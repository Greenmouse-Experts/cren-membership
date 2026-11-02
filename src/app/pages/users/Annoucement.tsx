// @ts-nocheck
import React from 'react'
import useGetHook from '../../hook/useGet'
import { TfiAnnouncement } from 'react-icons/tfi'
import dayjs from 'dayjs'
import useModal from '../../hook/useModal'
import { useState } from 'react'
import { formatString } from '../../services/helpers'
import ViewAnnounce from '../../admin/Announcement/ViewAnnounce'

const MembersAnnoucement = () => {
  const {data, loading} = useGetHook('member/announcements')
  const [selected, setSelected] = useState();
  const { Modal: View, setShowModal: showView } = useModal();
  const openViewAnnounce = (item) => {
    setSelected(item);
    showView(true);
  };
  return (
    <>
      <div className="pt-10 px-3 pl-10 grid gap-y-4">
          {data &&
            data?.data.length &&
            data.data.map((item, i) => (
              <div
                className="shadow w-full bg-white flex items-center justify-between hover:scale-105  duration-100 cursor-pointer"
                onClick={() => openViewAnnounce(item)}
                key={i}
              >
                <div className="flex items-center gap-x-5">
                  <div className="bg-blue-900 py-3 px-4">
                    <TfiAnnouncement className="text-2xl text-white" />
                  </div>
                  <p className="py-2">{formatString(item.content, 60)}</p>
                </div>
                <div className="pr-6 flex gap-x-2" onClick={(e) => e.stopPropagation()}>
                  <p>{dayjs(item.created_at).format("ddd-DD-MM-YYYY")}</p>
                </div>
              </div>
            ))}
        </div>
        <View title={selected?.title}>
        <ViewAnnounce close={() => showView(false)} item={selected} />
      </View>
    </>
  )
}

export default MembersAnnoucement