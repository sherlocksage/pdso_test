def solution_code(a,b,c):
    return int(a)+int(b)+int(c)
if __name__ == '__main__':
    import os
    import sys
    inputs = sys.argv[1].split(',')
    expected_result = str(sys.argv[2])

    assert str(solution_code(*inputs)) == str(sys.argv[2]), f'Incorrect result. Inputs: {inputs}. Expected results: {expected_result}'
