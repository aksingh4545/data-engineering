// Complete Python Exercises and Quizzes Dataset for the Platform
// Divided into topics and quizzes as requested by the user

export const pythonExercises = [
  // 1. Basic Problems
  {
    id: "comment",
    category: "Basic Problems",
    title: "Comment",
    difficulty: "Easy",
    description: "Write comments in Python to describe the code. Add a single-line comment beginning with '#' and print 'Hello Comments'.",
    starterCode: "# Write a single-line comment here\nprint('Hello Comments')",
    solutionCode: "# This is a comment\nprint('Hello Comments')",
    testCases: [{ input: "", expected: "Hello Comments\n" }]
  },
  {
    id: "printing",
    category: "Basic Problems",
    title: "Printing",
    difficulty: "Easy",
    description: "Use the print() function to output text. Print the phrase 'Learning Python is fun!' to the console.",
    starterCode: "# Print the text 'Learning Python is fun!' below\n",
    solutionCode: "print('Learning Python is fun!')",
    testCases: [{ input: "", expected: "Learning Python is fun!\n" }]
  },
  {
    id: "multi-printing",
    category: "Basic Problems",
    title: "Multi Printing",
    difficulty: "Easy",
    description: "Use the string multiplication operator '*' to print the word 'Python' 5 times.",
    starterCode: "# Print 'Python' 5 times using string multiplication\n",
    solutionCode: "print('Python' * 5)",
    testCases: [{ input: "", expected: "PythonPythonPythonPythonPython\n" }]
  },
  {
    id: "int-str",
    category: "Basic Problems",
    title: "Int Str",
    difficulty: "Easy",
    description: "Convert the integer 100 to a string using str() and print its type or values.",
    starterCode: "num = 100\n# Convert to string and print it\nprint(str(num))",
    solutionCode: "num = 100\nprint(str(num))",
    testCases: [{ input: "", expected: "100\n" }]
  },

  // 2. Conditional Statement and Loops Problems
  {
    id: "multiplication-table",
    category: "Conditional Statement and Loops Problems",
    title: "Multiplication Table",
    difficulty: "Easy",
    description: "Write a program that uses a loop to print the multiplication table of 5 up to 5 * 5.",
    starterCode: "# Print multiplication table of 5 up to 5 * 5\nfor i in range(1, 6):\n    # print output here\n    pass",
    solutionCode: "for i in range(1, 6):\n    print(f'5 * {i} = {5 * i}')",
    testCases: [{ input: "", expected: "5 * 1 = 5\n5 * 2 = 10\n5 * 3 = 15\n5 * 4 = 20\n5 * 5 = 25\n" }]
  },
  {
    id: "even-positioned-character",
    category: "Conditional Statement and Loops Problems",
    title: "Even Positioned Character",
    difficulty: "Easy",
    description: "Iterate over a string 'python' and print characters present at even indexes (0, 2, 4).",
    starterCode: "text = 'python'\n# Print characters at even positions\n",
    solutionCode: "text = 'python'\nfor i in range(len(text)):\n    if i % 2 == 0:\n        print(text[i])",
    testCases: [{ input: "", expected: "p\nt\no\n" }]
  },
  {
    id: "while-loop",
    category: "Conditional Statement and Loops Problems",
    title: "While loop",
    difficulty: "Easy",
    description: "Use a while loop to print numbers from 1 to 5.",
    starterCode: "# Print 1 to 5 using a while loop\ni = 1\n",
    solutionCode: "i = 1\nwhile i <= 5:\n    print(i)\n    i += 1",
    testCases: [{ input: "", expected: "1\n2\n3\n4\n5\n" }]
  },
  {
    id: "jumping-through-while",
    category: "Conditional Statement and Loops Problems",
    title: "Jumping through While",
    difficulty: "Easy",
    description: "Write a while loop from 1 to 5 that skips the number 3 using the 'continue' keyword.",
    starterCode: "# Print numbers from 1 to 5 skipping 3\ni = 0\nwhile i < 5:\n    i += 1\n    # Implement check here\n",
    solutionCode: "i = 0\nwhile i < 5:\n    i += 1\n    if i == 3:\n        continue\n    print(i)",
    testCases: [{ input: "", expected: "1\n2\n4\n5\n" }]
  },
  {
    id: "zero-converter",
    category: "Conditional Statement and Loops Problems",
    title: "Zero Converter",
    difficulty: "Easy",
    description: "Write a function zero_converter(n) that prints 'Zero' if n is 0, 'Positive' if n > 0, and 'Negative' if n < 0.",
    starterCode: "def zero_converter(n):\n    # Write condition here\n    if n == 0:\n        print('Zero')\n    elif n > 0:\n        print('Positive')\n    else:\n        print('Negative')\n\nzero_converter(0)\nzero_converter(5)\nzero_converter(-5)",
    solutionCode: "def zero_converter(n):\n    if n == 0:\n        print('Zero')\n    elif n > 0:\n        print('Positive')\n    else:\n        print('Negative')\n\nzero_converter(0)\nzero_converter(5)\nzero_converter(-5)",
    testCases: [{ input: "", expected: "Zero\nPositive\nNegative\n" }]
  },
  {
    id: "the-else-statement",
    category: "Conditional Statement and Loops Problems",
    title: "The Else Statement",
    difficulty: "Easy",
    description: "Demonstrate the use of an else clause in a for loop. Loop through [1, 2], print them, and print 'Finished' in the else block.",
    starterCode: "# Loop through [1, 2] and print else statement\n",
    solutionCode: "for x in [1, 2]:\n    print(x)\nelse:\n    print('Finished')",
    testCases: [{ input: "", expected: "1\n2\nFinished\n" }]
  },

  // 3. Functions Problems
  {
    id: "function-with-return-value",
    category: "Functions Problems",
    title: "Function With Return Value",
    difficulty: "Easy",
    description: "Create a function square(x) that returns the square of a number, and print the square of 6.",
    starterCode: "def square(x):\n    # Return square\n    pass\n\nprint(square(6))",
    solutionCode: "def square(x):\n    return x * x\n\nprint(square(6))",
    testCases: [{ input: "", expected: "36\n" }]
  },
  {
    id: "function-with-no-arguments",
    category: "Functions Problems",
    title: "Function With No Arguments",
    difficulty: "Easy",
    description: "Write a function greet() that accepts no arguments and prints 'Hello, Python Learner!'. Call it once.",
    starterCode: "def greet():\n    # print message\n    pass\n\ngreet()",
    solutionCode: "def greet():\n    print('Hello, Python Learner!')\n\ngreet()",
    testCases: [{ input: "", expected: "Hello, Python Learner!\n" }]
  },
  {
    id: "function-with-arguments",
    category: "Functions Problems",
    title: "Function With Arguments",
    difficulty: "Easy",
    description: "Write a function add_numbers(a, b) that prints the sum of a and b. Call it with add_numbers(20, 30).",
    starterCode: "def add_numbers(a, b):\n    # print sum\n    pass\n\nadd_numbers(20, 30)",
    solutionCode: "def add_numbers(a, b):\n    print(a + b)\n\nadd_numbers(20, 30)",
    testCases: [{ input: "", expected: "50\n" }]
  },
  {
    id: "first-digit-of-a-number",
    category: "Functions Problems",
    title: "First Digit of a Number",
    difficulty: "Easy",
    description: "Write a function first_digit(n) that returns the first digit of a positive integer n. Print first_digit(987).",
    starterCode: "def first_digit(n):\n    # Return first digit\n    pass\n\nprint(first_digit(987))",
    solutionCode: "def first_digit(n):\n    return int(str(n)[0])\n\nprint(first_digit(987))",
    testCases: [{ input: "", expected: "9\n" }]
  },
  {
    id: "print-gfg-n-times",
    category: "Functions Problems",
    title: "Print GFG n times",
    difficulty: "Easy",
    description: "Write a function print_gfg(n) that prints 'GFG' n times, each on a new line. Call print_gfg(3).",
    starterCode: "def print_gfg(n):\n    # print 'GFG' n times\n    pass\n\nprint_gfg(3)",
    solutionCode: "def print_gfg(n):\n    for _ in range(n):\n        print('GFG')\n\nprint_gfg(3)",
    testCases: [{ input: "", expected: "GFG\nGFG\nGFG\n" }]
  },

  // 4. List Problems
  {
    id: "list-traversal",
    category: "List Problems",
    title: "List Traversal",
    difficulty: "Easy",
    description: "Traverse a list [10, 20, 30, 40] and print each element on a new line.",
    starterCode: "lst = [10, 20, 30, 40]\n# Traverse list\n",
    solutionCode: "lst = [10, 20, 30, 40]\nfor x in lst:\n    print(x)",
    testCases: [{ input: "", expected: "10\n20\n30\n40\n" }]
  },
  {
    id: "length-of-the-list",
    category: "List Problems",
    title: "Length of The List",
    difficulty: "Easy",
    description: "Find and print the length of the list ['apple', 'banana', 'cherry'].",
    starterCode: "fruits = ['apple', 'banana', 'cherry']\n# Print length\n",
    solutionCode: "fruits = ['apple', 'banana', 'cherry']\nprint(len(fruits))",
    testCases: [{ input: "", expected: "3\n" }]
  },
  {
    id: "sum-the-list",
    category: "List Problems",
    title: "Sum The List",
    difficulty: "Easy",
    description: "Calculate and print the sum of elements in the list [5, 10, 15, 20].",
    starterCode: "lst = [5, 10, 15, 20]\n# Print sum\n",
    solutionCode: "lst = [5, 10, 15, 20]\nprint(sum(lst))",
    testCases: [{ input: "", expected: "50\n" }]
  },
  {
    id: "decrement-list-values",
    category: "List Problems",
    title: "Decrement List Values",
    difficulty: "Easy",
    description: "Given a list [10, 20, 30], decrement each value by 1 and print the resulting list.",
    starterCode: "lst = [10, 20, 30]\n# Decrement values and print\n",
    solutionCode: "lst = [10, 20, 30]\nres = [x - 1 for x in lst]\nprint(res)",
    testCases: [{ input: "", expected: "[9, 19, 29]\n" }]
  },
  {
    id: "append-to-list",
    category: "List Problems",
    title: "Append To List",
    difficulty: "Easy",
    description: "Start with an empty list, append elements 1, 2, and 3, and print the list.",
    starterCode: "lst = []\n# Append elements and print\n",
    solutionCode: "lst = []\nlst.append(1)\nlst.append(2)\nlst.append(3)\nprint(lst)",
    testCases: [{ input: "", expected: "[1, 2, 3]\n" }]
  },
  {
    id: "less-than",
    category: "List Problems",
    title: "Less Than",
    difficulty: "Easy",
    description: "Given a list [2, 12, 5, 8, 20, 3], filter elements that are less than 10 and print them.",
    starterCode: "lst = [2, 12, 5, 8, 20, 3]\n# Print elements less than 10\n",
    solutionCode: "lst = [2, 12, 5, 8, 20, 3]\nres = [x for x in lst if x < 10]\nprint(res)",
    testCases: [{ input: "", expected: "[2, 5, 8, 3]\n" }]
  },
  {
    id: "average",
    category: "List Problems",
    title: "Average",
    difficulty: "Easy",
    description: "Find the average of numbers inside a list [10, 20, 30, 40]. Print the result.",
    starterCode: "lst = [10, 20, 30, 40]\n# Print average\n",
    solutionCode: "lst = [10, 20, 30, 40]\nprint(sum(lst) / len(lst))",
    testCases: [{ input: "", expected: "25.0\n" }]
  },

  // 5. String Problems
  {
    id: "repeat-the-strings",
    category: "String Problems",
    title: "Repeat the Strings",
    difficulty: "Easy",
    description: "Repeat a string 'Hi!' 3 times separated by spaces using string formatting or repetition and print it.",
    starterCode: "# Print 'Hi! Hi! Hi!' using repetition\n",
    solutionCode: "print(' '.join(['Hi!'] * 3))",
    testCases: [{ input: "", expected: "Hi! Hi! Hi!\n" }]
  },
  {
    id: "string-function",
    category: "String Problems",
    title: "String Function",
    difficulty: "Easy",
    description: "Check if the string 'Data' starts with 'D' and ends with 'a' and print the boolean results.",
    starterCode: "text = 'Data'\n# Print starts with 'D' and ends with 'a'\n",
    solutionCode: "text = 'Data'\nprint(text.startswith('D'))\nprint(text.endswith('a'))",
    testCases: [{ input: "", expected: "True\nTrue\n" }]
  },
  {
    id: "convert-string-to-lowercase",
    category: "String Problems",
    title: "Convert String to LowerCase",
    difficulty: "Easy",
    description: "Convert a string 'WELCOME' to lower case and print the result.",
    starterCode: "text = 'WELCOME'\n# Convert to lower case and print\n",
    solutionCode: "text = 'WELCOME'\nprint(text.lower())",
    testCases: [{ input: "", expected: "welcome\n" }]
  },
  {
    id: "reverse-string",
    category: "String Problems",
    title: "Reverse String",
    difficulty: "Easy",
    description: "Reverse a string 'DataScience' using string slicing and print the output.",
    starterCode: "text = 'DataScience'\n# Reverse text\n",
    solutionCode: "text = 'DataScience'\nprint(text[::-1])",
    testCases: [{ input: "", expected: "ecneicSataD\n" }]
  },
  {
    id: "check-palindrome",
    category: "String Problems",
    title: "Check Palindrome",
    difficulty: "Easy",
    description: "Write a program to check if the string 'radar' is a palindrome. Print True or False.",
    starterCode: "text = 'radar'\n# Check palindrome and print\n",
    solutionCode: "text = 'radar'\nprint(text == text[::-1])",
    testCases: [{ input: "", expected: "True\n" }]
  },
  {
    id: "find-pattern",
    category: "String Problems",
    title: "Find Pattern",
    difficulty: "Easy",
    description: "Find the starting index of a pattern 'cat' in the string 'the lazy cat jumps'. Print the index.",
    starterCode: "text = 'the lazy cat jumps'\n# Print index of 'cat'\n",
    solutionCode: "text = 'the lazy cat jumps'\nprint(text.find('cat'))",
    testCases: [{ input: "", expected: "9\n" }]
  },
  {
    id: "decimal-to-binary",
    category: "String Problems",
    title: "Decimal to Binary",
    difficulty: "Easy",
    description: "Convert decimal integer 10 to a binary string representation and print it (without the '0b' prefix).",
    starterCode: "num = 10\n# Convert to binary string and print\n",
    solutionCode: "num = 10\nprint(bin(num)[2:])",
    testCases: [{ input: "", expected: "1010\n" }]
  },

  // 6. Dictionary Problems
  {
    id: "intro-to-dictionary",
    category: "Dictionary Problems",
    title: "Intro to Dictionary",
    difficulty: "Easy",
    description: "Create a dictionary with keys 'brand' = 'Ford' and 'year' = 2026. Print the dictionary.",
    starterCode: "# Create dictionary and print\n",
    solutionCode: "car = {'brand': 'Ford', 'year': 2026}\nprint(car)",
    testCases: [{ input: "", expected: "{'brand': 'Ford', 'year': 2026}\n" }]
  },
  {
    id: "dictionary",
    category: "Dictionary Problems",
    title: "Dictionary",
    difficulty: "Easy",
    description: "Add a new key 'color' with value 'red' to an existing dictionary `car = {'brand': 'Ford'}` and print the dictionary.",
    starterCode: "car = {'brand': 'Ford'}\n# Add key 'color' and print\n",
    solutionCode: "car = {'brand': 'Ford'}\ncar['color'] = 'red'\nprint(car)",
    testCases: [{ input: "", expected: "{'brand': 'Ford', 'color': 'red'}\n" }]
  },
  {
    id: "longest-subarray-with-sum-k",
    category: "Dictionary Problems",
    title: "Longest Subarray with Sum K",
    difficulty: "Medium",
    description: "Given an array [10, 5, 2, 7, 1, 9] and sum K = 15, find the length of the longest subarray with sum equal to K. Print the length.",
    starterCode: "arr = [10, 5, 2, 7, 1, 9]\nk = 15\n# Find length and print\n",
    solutionCode: "arr = [10, 5, 2, 7, 1, 9]\nk = 15\n# Prefix sum hash map\nprefix_sums = {}\ncurr_sum = 0\nmax_len = 0\nfor i in range(len(arr)):\n    curr_sum += arr[i]\n    if curr_sum == k:\n        max_len = i + 1\n    if (curr_sum - k) in prefix_sums:\n        max_len = max(max_len, i - prefix_sums[curr_sum - k])\n    if curr_sum not in prefix_sums:\n        prefix_sums[curr_sum] = i\nprint(max_len)",
    testCases: [{ input: "", expected: "4\n" }]
  },
  {
    id: "sort-according-to-an-array",
    category: "Dictionary Problems",
    title: "Sort According to an Array",
    difficulty: "Medium",
    description: "Sort list A1 = [2, 1, 2, 5, 7, 1, 9, 3, 6, 8, 8] according to relative order in A2 = [2, 1, 8, 3]. Elements not in A2 should be sorted in ascending order at the end. Print the sorted list.",
    starterCode: "a1 = [2, 1, 2, 5, 7, 1, 9, 3, 6, 8, 8]\na2 = [2, 1, 8, 3]\n# Sort according to a2 relative order and print\n",
    solutionCode: "a1 = [2, 1, 2, 5, 7, 1, 9, 3, 6, 8, 8]\na2 = [2, 1, 8, 3]\n\norder = {val: idx for idx, val in enumerate(a2)}\n\ndef custom_sort(x):\n    if x in order:\n        return (0, order[x])\n    else:\n        return (1, x)\n\na1.sort(key=custom_sort)\nprint(a1)",
    testCases: [{ input: "", expected: "[2, 2, 1, 1, 8, 8, 3, 5, 6, 7, 9]\n" }]
  },
  {
    id: "first-repeating-element",
    category: "Dictionary Problems",
    title: "First Repeating Element",
    difficulty: "Medium",
    description: "Find the first repeating element in array [10, 5, 3, 4, 3, 5, 6]. Print the element.",
    starterCode: "arr = [10, 5, 3, 4, 3, 5, 6]\n# Find first repeating element and print\n",
    solutionCode: "arr = [10, 5, 3, 4, 3, 5, 6]\ncounts = {}\nfor x in arr:\n    counts[x] = counts.get(x, 0) + 1\nfirst_rep = None\nfor x in arr:\n    if counts[x] > 1:\n        first_rep = x\n        break\nprint(first_rep)",
    testCases: [{ input: "", expected: "5\n" }]
  },

  // 7. Set Problems
  {
    id: "set-operations",
    category: "Set Problems",
    title: "Set Operations",
    difficulty: "Easy",
    description: "Perform union and intersection of sets s1 = {1, 2, 3} and s2 = {3, 4, 5}. Print results.",
    starterCode: "s1 = {1, 2, 3}\ns2 = {3, 4, 5}\n# Print union and intersection\n",
    solutionCode: "s1 = {1, 2, 3}\ns2 = {3, 4, 5}\nprint(s1.union(s2))\nprint(s1.intersection(s2))",
    testCases: [{ input: "", expected: "{1, 2, 3, 4, 5}\n{3}\n" }]
  },
  {
    id: "set",
    category: "Set Problems",
    title: "Set",
    difficulty: "Easy",
    description: "Remove duplicate elements from list [1, 2, 2, 3, 4, 4] using set() and print the sorted set.",
    starterCode: "lst = [1, 2, 2, 3, 4, 4]\n# Convert to set and print sorted list\n",
    solutionCode: "lst = [1, 2, 2, 3, 4, 4]\nprint(sorted(list(set(lst))))",
    testCases: [{ input: "", expected: "[1, 2, 3, 4]\n" }]
  },
  {
    id: "multiset-operations",
    category: "Set Problems",
    title: "Multiset Operations",
    difficulty: "Medium",
    description: "Simulate a multiset using a dictionary. Add element 1 twice, element 2 once, print keys, then remove element 1 once and print keys.",
    starterCode: "# Multiset simulation\n",
    solutionCode: "multiset = {}\ndef add(x):\n    multiset[x] = multiset.get(x, 0) + 1\ndef remove(x):\n    if x in multiset:\n        multiset[x] -= 1\n        if multiset[x] == 0:\n            del multiset[x]\n\nadd(1)\nadd(1)\nadd(2)\nprint(sorted(list(multiset.keys())))\nremove(1)\nprint(sorted(list(multiset.keys())))",
    testCases: [{ input: "", expected: "[1, 2]\n[1, 2]\n" }]
  },
  {
    id: "union-of-arrays-with-duplicates",
    category: "Set Problems",
    title: "Union of Arrays with Duplicates",
    difficulty: "Easy",
    description: "Find the size of union of two arrays A = [1, 2, 1, 1, 5] and B = [2, 3, 3, 5, 6]. Print the size.",
    starterCode: "a = [1, 2, 1, 1, 5]\nb = [2, 3, 3, 5, 6]\n# Print union count\n",
    solutionCode: "a = [1, 2, 1, 1, 5]\nb = [2, 3, 3, 5, 6]\nprint(len(set(a).union(set(b))))",
    testCases: [{ input: "", expected: "5\n" }]
  },
  {
    id: "distinct-elements",
    category: "Set Problems",
    title: "Distinct elements",
    difficulty: "Easy",
    description: "Check if all elements in array [1, 2, 3, 4, 5] are distinct. Print True or False.",
    starterCode: "arr = [1, 2, 3, 4, 5]\n# Print True if distinct else False\n",
    solutionCode: "arr = [1, 2, 3, 4, 5]\nprint(len(arr) == len(set(arr)))",
    testCases: [{ input: "", expected: "True\n" }]
  },

  // 8. OOP Problems
  {
    id: "design-a-class",
    category: "OOP Problems",
    title: "Design a class",
    difficulty: "Easy",
    description: "Design a class Person with instance variables name and age. Create an instance with 'Alex', 25, and print name.",
    starterCode: "class Person:\n    # Define constructor\n    pass\n\np = Person('Alex', 25)\nprint(p.name)",
    solutionCode: "class Person:\n    def __init__(self, name, age):\n        self.name = name\n        self.age = age\n\np = Person('Alex', 25)\nprint(p.name)",
    testCases: [{ input: "", expected: "Alex\n" }]
  },
  {
    id: "constructor",
    category: "OOP Problems",
    title: "Constructor",
    difficulty: "Easy",
    description: "Design a class Car that initializes 'make' and 'model' and prints 'Car Created' during construction. Instantiate once.",
    starterCode: "class Car:\n    # Define constructor\n    pass\n\nc = Car('Toyota', 'Camry')",
    solutionCode: "class Car:\n    def __init__(self, make, model):\n        self.make = make\n        self.model = model\n        print('Car Created')\n\nc = Car('Toyota', 'Camry')",
    testCases: [{ input: "", expected: "Car Created\n" }]
  },
  {
    id: "encapsulation",
    category: "OOP Problems",
    title: "Encapsulation",
    difficulty: "Easy",
    description: "Create a class BankAccount with a private attribute __balance. Provide a getter method get_balance(). Set balance to 1000 and print it.",
    starterCode: "class BankAccount:\n    def __init__(self, balance):\n        # Initialize private balance\n        pass\n\naccount = BankAccount(1000)\n# Print balance using getter",
    solutionCode: "class BankAccount:\n    def __init__(self, balance):\n        self.__balance = balance\n    def get_balance(self):\n        return self.__balance\n\naccount = BankAccount(1000)\nprint(account.get_balance())",
    testCases: [{ input: "", expected: "1000\n" }]
  },
  {
    id: "abstraction",
    category: "OOP Problems",
    title: "Abstraction",
    difficulty: "Medium",
    description: "Define an abstract class Animal with an abstract method speak(). Create a Dog subclass that returns 'Woof'. Print speak() value.",
    starterCode: "from abc import ABC, abstractmethod\n\nclass Animal(ABC):\n    @abstractmethod\n    def speak(self):\n        pass\n\n# Create Dog subclass\n",
    solutionCode: "from abc import ABC, abstractmethod\n\nclass Animal(ABC):\n    @abstractmethod\n    def speak(self):\n        pass\n\nclass Dog(Animal):\n    def speak(self):\n        return 'Woof'\n\nd = Dog()\nprint(d.speak())",
    testCases: [{ input: "", expected: "Woof\n" }]
  },
  {
    id: "static-method",
    category: "OOP Problems",
    title: "Static Method",
    difficulty: "Easy",
    description: "Create a class MathUtils with a static method add(x, y) that returns their sum. Call and print MathUtils.add(5, 7).",
    starterCode: "class MathUtils:\n    # Define static method add\n    pass\n\nprint(MathUtils.add(5, 7))",
    solutionCode: "class MathUtils:\n    @staticmethod\n    def add(x, y):\n        return x + y\n\nprint(MathUtils.add(5, 7))",
    testCases: [{ input: "", expected: "12\n" }]
  },

  // 9. Heap Problems
  {
    id: "height-of-heap",
    category: "Heap Problems",
    title: "Height of Heap",
    difficulty: "Medium",
    description: "Given a heap of size N = 6, calculate and print the height of the heap (number of levels, log2(N)).",
    starterCode: "import math\nn = 6\n# Calculate height and print\n",
    solutionCode: "import math\nn = 6\nheight = math.ceil(math.log2(n + 1)) - 1\nprint(height)",
    testCases: [{ input: "", expected: "2\n" }]
  },
  {
    id: "minimum-cost-of-ropes",
    category: "Heap Problems",
    title: "Minimum Cost of ropes",
    difficulty: "Medium",
    description: "Find the minimum cost of connecting N ropes of sizes [4, 3, 2, 6] using min heap. Print the cost.",
    starterCode: "import heapq\nropes = [4, 3, 2, 6]\n# Find minimum cost and print\n",
    solutionCode: "import heapq\nropes = [4, 3, 2, 6]\nheapq.heapify(ropes)\ncost = 0\nwhile len(ropes) > 1:\n    first = heapq.heappop(ropes)\n    second = heapq.heappop(ropes)\n    cost += first + second\n    heapq.heappush(ropes, first + second)\nprint(cost)",
    testCases: [{ input: "", expected: "29\n" }]
  },
  {
    id: "maximum-diamonds",
    category: "Heap Problems",
    title: "Maximum Diamonds",
    difficulty: "Medium",
    description: "Given N bags of diamonds [2, 1, 7, 4, 2] and K = 3 minutes. Each bag's count halves when taken. Return max diamonds gathered.",
    starterCode: "import heapq\nbags = [2, 1, 7, 4, 2]\nk = 3\n# Gathering loop and print max diamonds\n",
    solutionCode: "import heapq\nbags = [2, 1, 7, 4, 2]\nk = 3\n# Max heap simulation using negative numbers\nmax_heap = [-x for x in bags]\nheapq.heapify(max_heap)\ntotal = 0\nfor _ in range(k):\n    curr = -heapq.heappop(max_heap)\n    total += curr\n    heapq.heappush(max_heap, -(curr // 2))\nprint(total)",
    testCases: [{ input: "", expected: "14\n" }]
  },
  {
    id: "k-largest-elements",
    category: "Heap Problems",
    title: "k largest elements",
    difficulty: "Medium",
    description: "Find the K = 2 largest elements in list [11, 3, 2, 1, 15, 5, 4] and print them in descending order.",
    starterCode: "import heapq\nlst = [11, 3, 2, 1, 15, 5, 4]\nk = 2\n# Find K largest elements and print\n",
    solutionCode: "import heapq\nlst = [11, 3, 2, 1, 15, 5, 4]\nk = 2\nres = heapq.nlargest(k, lst)\nprint(res)",
    testCases: [{ input: "", expected: "[15, 11]\n" }]
  },

  // 10. Deque Problems
  {
    id: "k-sized-subarray-maximum",
    category: "Deque Problems",
    title: "K Sized Subarray Maximum",
    difficulty: "Hard",
    description: "Find the maximum for each contiguous subarray of size K = 3 in list [1, 2, 3, 1, 4, 5, 2, 3, 6]. Print result list.",
    starterCode: "from collections import deque\narr = [1, 2, 3, 1, 4, 5, 2, 3, 6]\nk = 3\n# Find sliding window maximum and print\n",
    solutionCode: "from collections import deque\narr = [1, 2, 3, 1, 4, 5, 2, 3, 6]\nk = 3\nres = []\nq = deque()\nfor i, x in enumerate(arr):\n    while q and q[0] <= i - k:\n        q.popleft()\n    while q and arr[q[-1]] <= x:\n        q.pop()\n    q.append(i)\n    if i >= k - 1:\n        res.append(arr[q[0]])\nprint(res)",
    testCases: [{ input: "", expected: "[3, 3, 4, 5, 5, 5, 6]\n" }]
  },
  {
    id: "negative-in-every-window-of-size-k",
    category: "Deque Problems",
    title: "Negative in every window of size k",
    difficulty: "Medium",
    description: "Find the first negative integer for each sliding window of size K = 2 in list [12, -1, -7, 8, -15, 30]. Print results.",
    starterCode: "from collections import deque\narr = [12, -1, -7, 8, -15, 30]\nk = 2\n# Print first negative in each window\n",
    solutionCode: "from collections import deque\narr = [12, -1, -7, 8, -15, 30]\nk = 2\nres = []\nnegatives = deque()\nfor i in range(len(arr)):\n    if arr[i] < 0:\n        negatives.append(i)\n    if negatives and negatives[0] <= i - k:\n        negatives.popleft()\n    if i >= k - 1:\n        if negatives:\n            res.append(arr[negatives[0]])\n        else:\n            res.append(0)\nprint(res)",
    testCases: [{ input: "", expected: "[-1, -1, -7, -15, -15]\n" }]
  },
  {
    id: "rotten-oranges",
    category: "Deque Problems",
    title: "Rotten Oranges",
    difficulty: "Hard",
    description: "Calculate the minimum time required to rot all oranges in a 3x3 grid where 2 is rotten, 1 is fresh, 0 is empty. Grid = [[2,1,1],[1,1,0],[0,1,1]]. Print minutes.",
    starterCode: "from collections import deque\ngrid = [[2,1,1],[1,1,0],[0,1,1]]\n# Calculate BFS minutes and print\n",
    solutionCode: "from collections import deque\ngrid = [[2,1,1],[1,1,0],[0,1,1]]\nrows, cols = len(grid), len(grid[0])\nq = deque()\nfresh = 0\nfor r in range(rows):\n    for c in range(cols):\n        if grid[r][c] == 2:\n            q.append((r, c, 0))\n        elif grid[r][c] == 1:\n            fresh += 1\nmins = 0\nwhile q:\n    r, c, d = q.popleft()\n    mins = max(mins, d)\n    for dr, dc in [(-1,0), (1,0), (0,-1), (0,1)]:\n        nr, nc = r + dr, c + dc\n        if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == 1:\n            grid[nr][nc] = 2\n            fresh -= 1\n            q.append((nr, nc, d + 1))\nprint(mins if fresh == 0 else -1)",
    testCases: [{ input: "", expected: "4\n" }]
  },

  // 11. Python Quizzes (Interactive Quizzes)
  {
    id: "quiz-variable",
    category: "Python Quizzes",
    title: "Variable",
    difficulty: "Easy",
    description: "Solve the quiz: What is the correct syntax to declare a variable in Python with value 5?",
    starterCode: "# Assign value 5 to variable x and print it\n",
    solutionCode: "x = 5\nprint(x)",
    testCases: [{ input: "", expected: "5\n" }]
  },
  {
    id: "quiz-data-types",
    category: "Python Quizzes",
    title: "Data Types",
    difficulty: "Easy",
    description: "Solve the quiz: What is the data type of the expression [1, 2, 'three']?",
    starterCode: "# Print type of [1, 2, 'three']\n",
    solutionCode: "print(type([1, 2, 'three']))",
    testCases: [{ input: "", expected: "<class 'list'>\n" }]
  },
  {
    id: "quiz-output",
    category: "Python Quizzes",
    title: "Output",
    difficulty: "Easy",
    description: "Solve the quiz: What is the output of print(2 ** 3)?",
    starterCode: "# Print 2 to the power of 3\n",
    solutionCode: "print(2 ** 3)",
    testCases: [{ input: "", expected: "8\n" }]
  },
  {
    id: "quiz-operator",
    category: "Python Quizzes",
    title: "Operator",
    difficulty: "Easy",
    description: "Solve the quiz: Which operator is used for integer floor division?",
    starterCode: "# Print floor division of 10 by 3 using the operator\n",
    solutionCode: "print(10 // 3)",
    testCases: [{ input: "", expected: "3\n" }]
  },
  {
    id: "quiz-control-flow",
    category: "Python Quizzes",
    title: "Control Flow",
    difficulty: "Easy",
    description: "Solve the quiz: Write an if-else statement checking if x = 15 is greater than 10. Print 'Yes' or 'No'.",
    starterCode: "x = 15\n# If-else checking x > 10\n",
    solutionCode: "x = 15\nif x > 10:\n    print('Yes')\nelse:\n    print('No')",
    testCases: [{ input: "", expected: "Yes\n" }]
  },
  {
    id: "quiz-for-loop",
    category: "Python Quizzes",
    title: "For Loop",
    difficulty: "Easy",
    description: "Solve the quiz: What does range(1, 4) produce when cast to a list?",
    starterCode: "# Cast range(1, 4) to list and print\n",
    solutionCode: "print(list(range(1, 4)))",
    testCases: [{ input: "", expected: "[1, 2, 3]\n" }]
  },
  {
    id: "quiz-while-loop",
    category: "Python Quizzes",
    title: "While Loop",
    difficulty: "Easy",
    description: "Solve the quiz: When does a while loop terminate?",
    starterCode: "# Print the condition when a while loop stops (e.g. 'when condition is false')\nprint('when condition is false')",
    solutionCode: "print('when condition is false')",
    testCases: [{ input: "", expected: "when condition is false\n" }]
  },
  {
    id: "quiz-python-list",
    category: "Python Quizzes",
    title: "Python List",
    difficulty: "Easy",
    description: "Solve the quiz: Which list method is used to remove an item by index? (e.g. pop)",
    starterCode: "lst = [10, 20, 30]\n# Pop element at index 1 and print list\n",
    solutionCode: "lst = [10, 20, 30]\nlst.pop(1)\nprint(lst)",
    testCases: [{ input: "", expected: "[10, 30]\n" }]
  },
  {
    id: "quiz-string",
    category: "Python Quizzes",
    title: "String",
    difficulty: "Easy",
    description: "Solve the quiz: Are strings in Python mutable or immutable? (Print 'mutable' or 'immutable')",
    starterCode: "# Print mutability of string\n",
    solutionCode: "print('immutable')",
    testCases: [{ input: "", expected: "immutable\n" }]
  },
  {
    id: "quiz-tuples",
    category: "Python Quizzes",
    title: "Tuples",
    difficulty: "Easy",
    description: "Solve the quiz: How do you declare a tuple with a single element 5?",
    starterCode: "# Declare and print tuple with single element 5\n",
    solutionCode: "t = (5,)\nprint(t)",
    testCases: [{ input: "", expected: "(5,)\n" }]
  },
  {
    id: "quiz-dictionary",
    category: "Python Quizzes",
    title: "Dictionary",
    difficulty: "Easy",
    description: "Solve the quiz: How do you retrieve all keys from a dictionary car = {'brand': 'Ford'}?",
    starterCode: "car = {'brand': 'Ford'}\n# Print keys\n",
    solutionCode: "car = {'brand': 'Ford'}\nprint(list(car.keys()))",
    testCases: [{ input: "", expected: "['brand']\n" }]
  },
  {
    id: "quiz-set",
    category: "Python Quizzes",
    title: "Set",
    difficulty: "Easy",
    description: "Solve the quiz: How do you add element 3 to a set {1, 2}?",
    starterCode: "s = {1, 2}\n# Add 3 and print sorted list of set\n",
    solutionCode: "s = {1, 2}\ns.add(3)\nprint(sorted(list(s)))",
    testCases: [{ input: "", expected: "[1, 2, 3]\n" }]
  },
  {
    id: "quiz-functions",
    category: "Python Quizzes",
    title: "Functions",
    difficulty: "Easy",
    description: "Solve the quiz: Which keyword is used to return values from a function?",
    starterCode: "# Print the keyword\n",
    solutionCode: "print('return')",
    testCases: [{ input: "", expected: "return\n" }]
  },
  {
    id: "quiz-namespace-and-scope",
    category: "Python Quizzes",
    title: "Namespace and Scope",
    difficulty: "Medium",
    description: "Solve the quiz: Which keyword is used inside a function to modify a global variable?",
    starterCode: "# Print scope keyword\n",
    solutionCode: "print('global')",
    testCases: [{ input: "", expected: "global\n" }]
  },
  {
    id: "quiz-oops",
    category: "Python Quizzes",
    title: "OOPs",
    difficulty: "Medium",
    description: "Solve the quiz: What is the first parameter of an instance method in a class? (e.g. self)",
    starterCode: "# Print parameter name\n",
    solutionCode: "print('self')",
    testCases: [{ input: "", expected: "self\n" }]
  },
  {
    id: "quiz-classes",
    category: "Python Quizzes",
    title: "Classes",
    difficulty: "Medium",
    description: "Solve the quiz: How do you declare a class Employee that inherits from Person?",
    starterCode: "# Write class declaration signature and print 'Success'\n",
    solutionCode: "print('class Employee(Person):')",
    testCases: [{ input: "", expected: "class Employee(Person):\n" }]
  },
  {
    id: "quiz-exception-handling",
    category: "Python Quizzes",
    title: "Exception Handling",
    difficulty: "Medium",
    description: "Solve the quiz: Which block always runs after try-except blocks, regardless of errors?",
    starterCode: "# Print block name\n",
    solutionCode: "print('finally')",
    testCases: [{ input: "", expected: "finally\n" }]
  },
  {
    id: "quiz-file-handling",
    category: "Python Quizzes",
    title: "File Handling",
    difficulty: "Medium",
    description: "Solve the quiz: Which mode is used to append data to an existing file in open()?",
    starterCode: "# Print mode char\n",
    solutionCode: "print('a')",
    testCases: [{ input: "", expected: "a\n" }]
  },
  {
    id: "quiz-heap",
    category: "Python Quizzes",
    title: "Heap",
    difficulty: "Medium",
    description: "Solve the quiz: Which heap function pushes an element into a heap? (e.g. heappush)",
    starterCode: "# Print function name\n",
    solutionCode: "print('heappush')",
    testCases: [{ input: "", expected: "heappush\n" }]
  },
  {
    id: "quiz-dequeue",
    category: "Python Quizzes",
    title: "Dequeue",
    difficulty: "Medium",
    description: "Solve the quiz: Which deque method adds an element to the left/start of the deque?",
    starterCode: "# Print method name\n",
    solutionCode: "print('appendleft')",
    testCases: [{ input: "", expected: "appendleft\n" }]
  },
  {
    id: "quiz-miscellaneous",
    category: "Python Quizzes",
    title: "Miscellaneous",
    difficulty: "Easy",
    description: "Solve the quiz: How do you exit a Python script programmatically? (e.g. exit() or sys.exit())",
    starterCode: "# Print answer\n",
    solutionCode: "print('sys.exit()')",
    testCases: [{ input: "", expected: "sys.exit()\n" }]
  }
];
