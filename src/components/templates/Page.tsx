import React from 'react'

interface IPageProps {
  children: React.ReactNode
}

const Page: React.FC<IPageProps> = ({ children }) => {
  return (
    <div className="container mx-auto py-10 space-y-10">
      <div className="size-fit mx-auto">
        {children}
      </div>
    </div>
  )
}

export default Page
