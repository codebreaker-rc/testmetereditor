import { PrismaClient, Difficulty, Language } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create sample Java questions
  const javaQuestions = [
    {
      title: 'Two Sum',
      description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

Example:
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].`,
      difficulty: Difficulty.EASY,
      language: Language.JAVA,
      category: 'Arrays',
      tags: ['array', 'hash-table'],
      starterCode: `package com.example;

public class Main {
    public static void main(String[] args) {
        int[] nums = {2, 7, 11, 15};
        int target = 9;
        
        int[] result = twoSum(nums, target);
        System.out.println("[" + result[0] + ", " + result[1] + "]");
    }
    
    public static int[] twoSum(int[] nums, int target) {
        // Write your code here
        
    }
}`,
      solution: `package com.example;

import java.util.HashMap;
import java.util.Map;

public class Main {
    public static void main(String[] args) {
        int[] nums = {2, 7, 11, 15};
        int target = 9;
        
        int[] result = twoSum(nums, target);
        System.out.println("[" + result[0] + ", " + result[1] + "]");
    }
    
    public static int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[] { map.get(complement), i };
            }
            map.put(nums[i], i);
        }
        return new int[] {};
    }
}`,
      testCases: {
        create: [
          { input: '2,7,11,15\n9', output: '[0, 1]', isHidden: false },
          { input: '3,2,4\n6', output: '[1, 2]', isHidden: false },
          { input: '3,3\n6', output: '[0, 1]', isHidden: true },
        ],
      },
    },
    {
      title: 'Reverse String',
      description: `Write a function that reverses a string. The input string is given as an array of characters s.

You must do this by modifying the input array in-place with O(1) extra memory.

Example:
Input: s = ["h","e","l","l","o"]
Output: ["o","l","l","e","h"]`,
      difficulty: Difficulty.EASY,
      language: Language.JAVA,
      category: 'Strings',
      tags: ['string', 'two-pointers'],
      starterCode: `package com.example;

public class Main {
    public static void main(String[] args) {
        char[] s = {'h', 'e', 'l', 'l', 'o'};
        reverseString(s);
        System.out.println(s);
    }
    
    public static void reverseString(char[] s) {
        // Write your code here
        
    }
}`,
      solution: `package com.example;

public class Main {
    public static void main(String[] args) {
        char[] s = {'h', 'e', 'l', 'l', 'o'};
        reverseString(s);
        System.out.println(s);
    }
    
    public static void reverseString(char[] s) {
        int left = 0, right = s.length - 1;
        while (left < right) {
            char temp = s[left];
            s[left] = s[right];
            s[right] = temp;
            left++;
            right--;
        }
    }
}`,
      testCases: {
        create: [
          { input: 'hello', output: 'olleh', isHidden: false },
          { input: 'Hannah', output: 'hannaH', isHidden: false },
        ],
      },
    },
    {
      title: 'Palindrome Number',
      description: `Given an integer x, return true if x is a palindrome, and false otherwise.

Example:
Input: x = 121
Output: true
Explanation: 121 reads as 121 from left to right and from right to left.`,
      difficulty: Difficulty.EASY,
      language: Language.JAVA,
      category: 'Math',
      tags: ['math'],
      starterCode: `package com.example;

public class Main {
    public static void main(String[] args) {
        int x = 121;
        System.out.println(isPalindrome(x));
    }
    
    public static boolean isPalindrome(int x) {
        // Write your code here
        
    }
}`,
      solution: `package com.example;

public class Main {
    public static void main(String[] args) {
        int x = 121;
        System.out.println(isPalindrome(x));
    }
    
    public static boolean isPalindrome(int x) {
        if (x < 0) return false;
        
        int original = x;
        int reversed = 0;
        
        while (x > 0) {
            reversed = reversed * 10 + x % 10;
            x /= 10;
        }
        
        return original == reversed;
    }
}`,
      testCases: {
        create: [
          { input: '121', output: 'true', isHidden: false },
          { input: '-121', output: 'false', isHidden: false },
          { input: '10', output: 'false', isHidden: true },
        ],
      },
    },
    {
      title: 'FizzBuzz',
      description: `Given an integer n, return a string array answer (1-indexed) where:

- answer[i] == "FizzBuzz" if i is divisible by 3 and 5.
- answer[i] == "Fizz" if i is divisible by 3.
- answer[i] == "Buzz" if i is divisible by 5.
- answer[i] == i (as a string) if none of the above conditions are true.

Example:
Input: n = 5
Output: ["1","2","Fizz","4","Buzz"]`,
      difficulty: Difficulty.EASY,
      language: Language.JAVA,
      category: 'Algorithms',
      tags: ['math', 'string'],
      starterCode: `package com.example;

import java.util.ArrayList;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        int n = 15;
        List<String> result = fizzBuzz(n);
        System.out.println(result);
    }
    
    public static List<String> fizzBuzz(int n) {
        // Write your code here
        
    }
}`,
      solution: `package com.example;

import java.util.ArrayList;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        int n = 15;
        List<String> result = fizzBuzz(n);
        System.out.println(result);
    }
    
    public static List<String> fizzBuzz(int n) {
        List<String> result = new ArrayList<>();
        for (int i = 1; i <= n; i++) {
            if (i % 15 == 0) {
                result.add("FizzBuzz");
            } else if (i % 3 == 0) {
                result.add("Fizz");
            } else if (i % 5 == 0) {
                result.add("Buzz");
            } else {
                result.add(String.valueOf(i));
            }
        }
        return result;
    }
}`,
      testCases: {
        create: [
          { input: '5', output: '[1, 2, Fizz, 4, Buzz]', isHidden: false },
          { input: '15', output: '[1, 2, Fizz, 4, Buzz, Fizz, 7, 8, Fizz, Buzz, 11, Fizz, 13, 14, FizzBuzz]', isHidden: false },
        ],
      },
    },
  ];

  for (const question of javaQuestions) {
    await prisma.question.create({
      data: question,
    });
  }

  console.log('✅ Seeded Java questions');

  // Add Python questions
  const pythonQuestions = [
    {
      title: 'Two Sum (Python)',
      description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.`,
      difficulty: Difficulty.EASY,
      language: Language.PYTHON,
      category: 'Arrays',
      tags: ['array', 'hash-table'],
      starterCode: `def two_sum(nums, target):
    # Write your code here
    pass

if __name__ == "__main__":
    nums = [2, 7, 11, 15]
    target = 9
    result = two_sum(nums, target)
    print(result)`,
      solution: `def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []

if __name__ == "__main__":
    nums = [2, 7, 11, 15]
    target = 9
    result = two_sum(nums, target)
    print(result)`,
      testCases: {
        create: [
          { input: '2,7,11,15\n9', output: '[0, 1]', isHidden: false },
        ],
      },
    },
  ];

  for (const question of pythonQuestions) {
    await prisma.question.create({
      data: question,
    });
  }

  console.log('✅ Seeded Python questions');

  // Add JavaScript questions
  const jsQuestions = [
    {
      title: 'Two Sum (JavaScript)',
      description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.`,
      difficulty: Difficulty.EASY,
      language: Language.JAVASCRIPT,
      category: 'Arrays',
      tags: ['array', 'hash-table'],
      starterCode: `function twoSum(nums, target) {
    // Write your code here
    
}

const nums = [2, 7, 11, 15];
const target = 9;
const result = twoSum(nums, target);
console.log(result);`,
      solution: `function twoSum(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        map.set(nums[i], i);
    }
    return [];
}

const nums = [2, 7, 11, 15];
const target = 9;
const result = twoSum(nums, target);
console.log(result);`,
      testCases: {
        create: [
          { input: '2,7,11,15\n9', output: '[0, 1]', isHidden: false },
        ],
      },
    },
  ];

  for (const question of jsQuestions) {
    await prisma.question.create({
      data: question,
    });
  }

  console.log('✅ Seeded JavaScript questions');
  console.log('🎉 Database seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
