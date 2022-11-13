import Head from 'next/head';
import React from 'react';

export interface LayoutProps {
  children: JSX.Element | JSX.Element[];
  classname?: string;
}

const Layout = (props: LayoutProps) => {
  const { children, classname } = props;

  return <>
    <Head>
      <title>Practical DevSecOps</title>
      <meta name="description" content="Practical DevSecOps" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <main className={`container mx-auto flex flex-col items-center min-h-screen ${classname}`}>
      {children}
    </main>
  </>

}

export default Layout;
