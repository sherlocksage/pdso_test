import { ChangeEvent, useEffect, useState } from "react"
import { useRouter } from "next/router"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"
import Link from "next/link"
import Layout from "../../components/Layout"


interface ProblemData {
  title: string,
  description: string
}

const problemApi = async (id: string): Promise<ProblemData> => {
  const res = await fetch(`http://localhost:8000/api/problem/${id}/`, {
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

interface TestCaseData {
  inputs: string,
  expected_result: string,
}

const testcasesApi = async (id: string): Promise<TestCaseData[]> => {
  const res = await fetch(`/api/testcases/${id}/`, {
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


const codetestApi = async (id: string, code: string, setSuccess: Function) => {
  const res = await fetch(`/api/test/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ "code": code, "problemId": id })
  })
  try {
    if (res.status === 200) {
      setSuccess("All tests passed!")
    } else {
      setSuccess(`Some tests failed ${await res.text()}`)
    }
  } catch (err) {
    setSuccess(`Internal server error ${await res.text()}`)
  }
}

const renderTestCases = (testcases: TestCaseData[]) => {
  const divs = []
  for (const item of testcases) {
    const { inputs, expected_result } = item
    const reformatted_inputs = inputs.split(",").join(", ")
    const div = (
      <div className="m-4">{`solution_code(${reformatted_inputs}) => ${expected_result}`}</div>
    )
    divs.push(div)
  }
  return divs
}

const ProblemPage = () => {
  const router = useRouter()
  const problemId = router.query.problemId as string
  const [data, setData] = useState<ProblemData>({ title: '', description: '' })
  const [testcases, setTestcases] = useState<TestCaseData[]>([])
  const [code, setCode] = useState("def solution_code():\n    pass")
  const [success, setSuccess] = useState("")

  const handleSubmit = (event: ChangeEvent<any>) => {
    event.preventDefault()
    codetestApi(problemId, code, setSuccess)
  }

  useEffect(() => {
    problemApi(problemId).then(items => setData(items))
  }, [])

  useEffect(() => {
    testcasesApi(problemId).then(items => setTestcases(items))
  }, [])

  return (
    <Layout>
      <Box className="p-4 self-start text-sm bg-slate-200 hover:bg-slate-300">
        <Link href="/">{"Back to main page"}</Link>
      </Box>
      <Box className="text-center w-full h-full">
        <Box className="grid grid-cols-3">
          <Box className="flex-1 p-4 gap-4 bg-gray-300 h-full">
            <h2 className="text-xl font-bold">{data.title}</h2>
            <h3>{data.description}</h3>
          </Box>
          <Box className="bg-gray-400">
            <h3 className="font-bold">Test Cases</h3>
            {renderTestCases(testcases)}
          </Box>
          <Box>
            <Box>
              <form onSubmit={handleSubmit}>
                <TextField
                  value={code}
                  onChange={(event: ChangeEvent<any>) => setCode(event.target.value)}
                  inputProps={{ 'aria-label': 'code' }}
                  variant="filled"
                  multiline
                  rows={20}
                  id="filled-input"
                  sx={{
                    width: "100%",
                    backgroundColor: "#334155",
                    '& #filled-input': {
                      color: '#f1f5f9',
                      fontFamily: 'monospace',
                    },
                  }}
                />
                <Button type="submit" variant="contained">Run Tests</Button>
              </form>
            </Box>
            <Box className="bg-slate-500 text-slate-50">
              {success}
            </Box>
          </Box>
        </Box>
      </Box>
    </Layout>
  )
}

export default ProblemPage
