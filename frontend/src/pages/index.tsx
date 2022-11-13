import { useEffect, useState } from "react";
import { type NextPage } from "next";
import Link from "next/link";
import Layout from "../components/Layout";

interface LinkData {
  id: string,
  title: string
}

const courseApi = async (): Promise<LinkData[]> => {
  const res = await fetch("api/courses/", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
  try {
    if (res.status === 200) {
      return res.json();
    } else {
      throw new Error(await res.text());
    }
  } catch (err) {
    throw new Error(err as string)
  }
}


const renderCourseLinks = (data: LinkData[]) => {
  const links = []
  for (let item of data) {
    const { id, title } = item
    links.push(
      <div className="p-2" key={id}>
        <Link href={`courses/${id}`}>{title}</Link>
      </div>
    )
  }
  return links
}

const Home: NextPage = () => {
  const [data, setData] = useState<LinkData[]>([])

  useEffect(() => {
    courseApi().then(items => setData(items))
  }, [])

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center gap-2 my-8">
        <h1 className="text-3xl font-bold leading-normal mb-4">
          Practical DevSecOps
        </h1>
        <div className="rounded-md border border-black p-4">
          {renderCourseLinks(data)}
        </div>
      </div>
    </Layout>
  )
}

export default Home;
