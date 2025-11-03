import React from 'react'
import useAccount from '../hooks/useAccount'
import AccountCreateView from '../views/AccountCreateView'

function AcccountCreatePage() {
  const {createAccount} = useAccount()
  return (
    <div><AccountCreateView createAccount={createAccount}/></div>
  )
}

export default AcccountCreatePage