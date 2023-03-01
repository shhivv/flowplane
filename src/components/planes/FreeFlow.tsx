import { type IPlane } from '../../state'
import { GiBlackHoleBolas } from 'react-icons/gi'
import React from 'react'

interface IFreeFlow {
  plane?: IPlane
}

export default function FreeFlow ({ plane }: IFreeFlow) {
  return (
    <div className="w-5/6 py-6 px-16 text-neutral-400 font-heading">
      <div className="flex items-center text-neutral-500 space-x-3">
        <GiBlackHoleBolas />
        <h3>{plane?.title}</h3>
      </div>
    </div>
  )
}
