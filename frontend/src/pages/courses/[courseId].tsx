import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import Box from "@mui/material/Box"
import Link from "next/link"
import Layout from "../../components/Layout"


interface CourseData {
  title: string,
  description: string
}

const courseApi = async (id: string): Promise<CourseData> => {
  const res = await fetch(`/api/course/${id}/`, {
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

interface LinkData {
  id: string,
  title: string
}

const problemApi = async (id: string): Promise<LinkData[]> => {
  const res = await fetch(`/api/problems/${id}/`, {
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


const renderProblemLinks = (data: LinkData[]) => {
  const links = []
  for (let item of data) {
    const { id, title } = item
    links.push(
      <div className="m-2 p-2 bg-slate-300 hover:bg-slate-400" key={id}>
        <Link href={`/problems/${id}`}>{title}</Link>
      </div>
    )
  }
  return links
}

const CoursePage = () => {
  const router = useRouter()
  const courseId = router.query.courseId as string
  const [data, setData] = useState<CourseData>({ title: '', description: '' })
  const [problems, setProblems] = useState<LinkData[]>([])

  useEffect(() => {
    courseApi(courseId).then(items => setData(items))
  }, [])

  useEffect(() => {
    problemApi(courseId).then(items => setProblems(items))
  }, [])
  return (
    <Layout>
      <Box className="p-4 self-start text-sm bg-slate-200 hover:bg-slate-300">
        <Link href="/">{"Back to main page"}</Link>
      </Box>
      <Box className="text-center p-4">
        <Box className="flex flex-col flex-1 m-2 p-4 gap-4 bg-gray-200">
          <h2 className="text-2xl font-bold">{data.title}</h2>
          <h3>{data.description}</h3>
        </Box>
        <Box className="bg-gray-200 p-2">
          <h3 className="text-xl">Problems</h3>
          {renderProblemLinks(problems)}
        </Box>
      </Box>
    </Layout>
  )
}

export default CoursePage
