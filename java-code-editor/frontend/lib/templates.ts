export type ProjectType = 'standard' | 'maven';

export interface Template {
  code: string;
  pom?: string;
  type: ProjectType;
}

export const JAVA_TEMPLATES: Record<string, Template> = {
  'Hello World': {
    type: 'standard',
    code: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
  },

  'Input/Output': {
    type: 'standard',
    code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        
        System.out.print("Enter your name: ");
        String name = scanner.nextLine();
        
        System.out.println("Hello, " + name + "!");
        
        scanner.close();
    }
}`,
  },

  'Array Operations': {
    type: 'standard',
    code: `public class Main {
    public static void main(String[] args) {
        int[] numbers = {5, 2, 8, 1, 9, 3};
        
        System.out.println("Original array:");
        printArray(numbers);
        
        int sum = 0;
        int max = numbers[0];
        int min = numbers[0];
        
        for (int num : numbers) {
            sum += num;
            if (num > max) max = num;
            if (num < min) min = num;
        }
        
        System.out.println("\\nSum: " + sum);
        System.out.println("Average: " + (sum / (double) numbers.length));
        System.out.println("Max: " + max);
        System.out.println("Min: " + min);
    }
    
    static void printArray(int[] arr) {
        for (int num : arr) {
            System.out.print(num + " ");
        }
        System.out.println();
    }
}`,
  },

  'Fibonacci': {
    type: 'standard',
    code: `public class Main {
    public static void main(String[] args) {
        int n = 10;
        System.out.println("First " + n + " Fibonacci numbers:");
        
        for (int i = 0; i < n; i++) {
            System.out.print(fibonacci(i) + " ");
        }
        System.out.println();
    }
    
    static int fibonacci(int n) {
        if (n <= 1) return n;
        return fibonacci(n - 1) + fibonacci(n - 2);
    }
}`,
  },

  'Sorting': {
    type: 'standard',
    code: `import java.util.Arrays;

public class Main {
    public static void main(String[] args) {
        int[] arr = {64, 34, 25, 12, 22, 11, 90};
        
        System.out.println("Original array:");
        System.out.println(Arrays.toString(arr));
        
        bubbleSort(arr);
        
        System.out.println("\\nSorted array:");
        System.out.println(Arrays.toString(arr));
    }
    
    static void bubbleSort(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n - 1; i++) {
            for (int j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
            }
        }
    }
}`,
  },

  'OOP Example': {
    type: 'standard',
    code: `class Person {
    private String name;
    private int age;
    
    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }
    
    public void introduce() {
        System.out.println("Hi, I'm " + name + " and I'm " + age + " years old.");
    }
    
    public void haveBirthday() {
        age++;
        System.out.println("Happy birthday! Now I'm " + age + " years old.");
    }
}

public class Main {
    public static void main(String[] args) {
        Person person = new Person("Alice", 25);
        person.introduce();
        person.haveBirthday();
    }
}`,
  },

  'Maven - Hello World': {
    type: 'maven',
    code: `package com.example;

public class Main {
    public static void main(String[] args) {
        System.out.println("Hello from Maven!");
    }
}`,
    pom: `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.example</groupId>
    <artifactId>java-app</artifactId>
    <version>1.0-SNAPSHOT</version>

    <properties>
        <maven.compiler.source>17</maven.compiler.source>
        <maven.compiler.target>17</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    </properties>

    <dependencies>
        <!-- Add your dependencies here -->
    </dependencies>
</project>`,
  },

  'Maven - JSON Processing': {
    type: 'maven',
    code: `package com.example;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import java.util.HashMap;
import java.util.Map;

public class Main {
    public static void main(String[] args) {
        Gson gson = new GsonBuilder().setPrettyPrinting().create();
        
        Map<String, Object> person = new HashMap<>();
        person.put("name", "John Doe");
        person.put("age", 30);
        person.put("city", "New York");
        
        String json = gson.toJson(person);
        System.out.println("JSON Output:");
        System.out.println(json);
    }
}`,
    pom: `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.example</groupId>
    <artifactId>java-app</artifactId>
    <version>1.0-SNAPSHOT</version>

    <properties>
        <maven.compiler.source>17</maven.compiler.source>
        <maven.compiler.target>17</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    </properties>

    <dependencies>
        <dependency>
            <groupId>com.google.code.gson</groupId>
            <artifactId>gson</artifactId>
            <version>2.10.1</version>
        </dependency>
    </dependencies>
</project>`,
  },

  'JUnit @Test Annotations': {
    type: 'maven',
    code: `package com.example;

import org.junit.Test;
import org.junit.Before;
import org.junit.After;
import static org.junit.Assert.*;

public class MainTest {
    private int testValue;
    
    @Before
    public void setUp() {
        testValue = 10;
        System.out.println("Setting up test...");
    }
    
    @After
    public void tearDown() {
        System.out.println("Cleaning up after test...");
    }
    
    @Test
    public void testAddition() {
        System.out.println("Running testAddition");
        int result = testValue + 5;
        assertEquals(15, result);
        System.out.println("✓ Addition test passed!");
    }
    
    @Test
    public void testSubtraction() {
        System.out.println("Running testSubtraction");
        int result = testValue - 3;
        assertEquals(7, result);
        System.out.println("✓ Subtraction test passed!");
    }
    
    @Test
    public void testStringComparison() {
        System.out.println("Running testStringComparison");
        String expected = "Hello";
        String actual = "Hello";
        assertEquals(expected, actual);
        System.out.println("✓ String comparison test passed!");
    }
    
    @Test
    public void testBooleanAssertion() {
        System.out.println("Running testBooleanAssertion");
        assertTrue(testValue > 5);
        assertFalse(testValue < 0);
        System.out.println("✓ Boolean assertion test passed!");
    }
}`,
    pom: `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.example</groupId>
    <artifactId>java-app</artifactId>
    <version>1.0-SNAPSHOT</version>

    <properties>
        <maven.compiler.source>17</maven.compiler.source>
        <maven.compiler.target>17</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    </properties>

    <dependencies>
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>4.13.2</version>
            <scope>test</scope>
        </dependency>
    </dependencies>
</project>`,
  },

  'JUnit Calculator Test': {
    type: 'maven',
    code: `package com.example;

import org.junit.Test;
import org.junit.BeforeClass;
import static org.junit.Assert.*;

public class MainTest {
    
    @BeforeClass
    public static void setUpClass() {
        System.out.println("=== Starting Calculator Tests ===\\n");
    }
    
    @Test
    public void testAdd() {
        System.out.println("Test: Addition");
        Calculator calc = new Calculator();
        int result = calc.add(5, 3);
        assertEquals(8, result);
        System.out.println("  5 + 3 = " + result + " ✓\\n");
    }
    
    @Test
    public void testSubtract() {
        System.out.println("Test: Subtraction");
        Calculator calc = new Calculator();
        int result = calc.subtract(10, 4);
        assertEquals(6, result);
        System.out.println("  10 - 4 = " + result + " ✓\\n");
    }
    
    @Test
    public void testMultiply() {
        System.out.println("Test: Multiplication");
        Calculator calc = new Calculator();
        int result = calc.multiply(6, 7);
        assertEquals(42, result);
        System.out.println("  6 × 7 = " + result + " ✓\\n");
    }
    
    @Test
    public void testDivide() {
        System.out.println("Test: Division");
        Calculator calc = new Calculator();
        double result = calc.divide(15.0, 3.0);
        assertEquals(5.0, result, 0.001);
        System.out.println("  15 ÷ 3 = " + result + " ✓\\n");
    }
    
    @Test(expected = ArithmeticException.class)
    public void testDivideByZero() {
        System.out.println("Test: Division by zero");
        Calculator calc = new Calculator();
        calc.divide(10.0, 0.0);
    }
}

class Calculator {
    public int add(int a, int b) {
        return a + b;
    }
    
    public int subtract(int a, int b) {
        return a - b;
    }
    
    public int multiply(int a, int b) {
        return a * b;
    }
    
    public double divide(double a, double b) {
        if (b == 0) {
            throw new ArithmeticException("Division by zero");
        }
        return a / b;
    }
}`,
    pom: `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.example</groupId>
    <artifactId>java-app</artifactId>
    <version>1.0-SNAPSHOT</version>

    <properties>
        <maven.compiler.source>17</maven.compiler.source>
        <maven.compiler.target>17</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    </properties>

    <dependencies>
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>4.13.2</version>
            <scope>test</scope>
        </dependency>
    </dependencies>
</project>`,
  },
};
