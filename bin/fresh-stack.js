#!/usr/bin/env node

import inquirer from "inquirer";
import chalk from "chalk";
import { execa } from "execa";
import fs from "fs";
import path from "path";
import which from "which";

const emoji = {
  check: "✅",
  fire: "🔥",
  star: "🌟",
  box: "📦",
  warn: "⚠️",
  boom: "💥",
  folder: "📁",
  code: "💻",
  run: "🚀",
};

const stacks = {
  react: { title: "ReactJS", deps: ["node", "npx"] },
  "react-native": { title: "React Native", deps: ["node", "npx"] },
  flutter: { title: "Flutter", deps: ["flutter"] },
  springboot: { title: "Spring Boot (Java)", deps: ["java", "curl", "unzip"] },
  nest: { title: "NestJS", deps: ["node", "npx"] },
  node: { title: "Node.js", deps: ["node"] },
  python: { title: "Python", deps: ["python3"] },
};

async function checkDeps(deps = []) {
  for (const dep of deps) {
    try {
      await which(dep);
    } catch {
      console.error(chalk.red(`❌ Missing dependency: ${dep}`));
      return false;
    }
  }
  return true;
}

async function fixFlutterGradleFiles(appDir, org) {
  const androidDir = path.join(appDir, "android");

  // Replace settings.gradle.kts with Groovy version
  const settingsGradleContent = `include ':app'
def flutterProjectRoot = rootProject.projectDir.parentFile.toPath()
def plugins = new Properties()
def pluginsFile = new File(rootProject.projectDir, '.flutter-plugins')
if (pluginsFile.exists()) {
    pluginsFile.withReader('UTF-8') { reader -> plugins.load(reader) }
}
plugins.each { name, path ->
    def pluginDirectory = flutterProjectRoot.resolve(path).resolve('android').toFile()
    include ":\$name"
    project(":\$name").projectDir = pluginDirectory
}`;
  fs.writeFileSync(
    path.join(androidDir, "settings.gradle"),
    settingsGradleContent
  );
  fs.rmSync(path.join(androidDir, "settings.gradle.kts"), { force: true });

  // Replace build.gradle.kts with Groovy version
  const buildGradleContent = `buildscript {
    ext.kotlin_version = '1.9.24'
    repositories {
        google()
        mavenCentral()
    }

    dependencies {
        classpath 'com.android.tools.build:gradle:8.3.2'
        classpath "org.jetbrains.kotlin:kotlin-gradle-plugin:\$kotlin_version"
    }
}

allprojects {
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.buildDir = '../build'
subprojects {
    project.buildDir = "\${rootProject.buildDir}/\${project.name}"
}
subprojects {
    project.evaluationDependsOn(':app')
}

tasks.register("clean", Delete) {
    delete rootProject.buildDir
}`;
  fs.writeFileSync(path.join(androidDir, "build.gradle"), buildGradleContent);
  fs.rmSync(path.join(androidDir, "build.gradle.kts"), { force: true });

  // Fix app/build.gradle
  const appBuildGradleContent = `def localProperties = new Properties()
def localPropertiesFile = rootProject.file('local.properties')
if (localPropertiesFile.exists()) {
    localPropertiesFile.withReader('UTF-8') { reader ->
        localProperties.load(reader)
    }
}

def flutterRoot = localProperties.getProperty('flutter.sdk')
if (flutterRoot == null) {
    throw new GradleException("Flutter SDK not found. Define location with flutter.sdk in the local.properties file.")
}

def flutterVersionCode = localProperties.getProperty('flutter.versionCode')
if (flutterVersionCode == null) {
    flutterVersionCode = '1'
}

def flutterVersionName = localProperties.getProperty('flutter.versionName')
if (flutterVersionName == null) {
    flutterVersionName = '1.0'
}

apply plugin: 'com.android.application'
apply plugin: 'kotlin-android'
apply from: "\$flutterRoot/packages/flutter_tools/gradle/flutter.gradle"

android {
    namespace "${org}.${path.basename(appDir)}"
    compileSdkVersion flutter.compileSdkVersion
    ndkVersion flutter.ndkVersion

    compileOptions {
        sourceCompatibility JavaVersion.VERSION_1_8
        targetCompatibility JavaVersion.VERSION_1_8
    }

    kotlinOptions {
        jvmTarget = '1.8'
    }

    sourceSets {
        main.java.srcDirs += 'src/main/kotlin'
    }

    defaultConfig {
        applicationId "${org}.${path.basename(appDir)}"
        minSdkVersion flutter.minSdkVersion
        targetSdkVersion flutter.targetSdkVersion
        versionCode flutterVersionCode.toInteger()
        versionName flutterVersionName
    }

    buildTypes {
        release {
            signingConfig signingConfigs.debug
        }
    }
}

flutter {
    source '../..'
}

dependencies {
    implementation "org.jetbrains.kotlin:kotlin-stdlib-jdk7:\$kotlin_version"
}`;
  fs.writeFileSync(
    path.join(androidDir, "app", "build.gradle"),
    appBuildGradleContent
  );
}

async function main() {
  console.log(chalk.cyan.bold(`${emoji.star} Welcome to Fresh Stack CLI`));

  const { selectedStack } = await inquirer.prompt([
    {
      type: "list",
      name: "selectedStack",
      message: "🛠 Choose a tech stack:",
      choices: Object.keys(stacks).map((key) => ({
        name: `${stacks[key].title} (${key})`,
        value: key,
      })),
    },
  ]);

  const stackConfig = stacks[selectedStack];
  const depsOkay = await checkDeps(stackConfig.deps);
  if (!depsOkay) {
    console.log(
      chalk.red(`❌ Please install the missing tools above and try again.`)
    );
    process.exit(1);
  }

  const { appName } = await inquirer.prompt({
    type: "input",
    name: "appName",
    message: "📛 Enter your app name:",
    validate: (input) =>
      /^[a-zA-Z0-9_-]+$/.test(input) ||
      "Use letters, numbers, dash or underscore only.",
  });

  const appDir = path.resolve(appName);

  if (fs.existsSync(appDir)) {
    const { overwrite } = await inquirer.prompt({
      type: "confirm",
      name: "overwrite",
      message: `${emoji.warn} Directory '${appName}' exists. Backup and overwrite?`,
      default: false,
    });

    if (!overwrite) {
      console.log(chalk.red(`${emoji.boom} Aborted.`));
      process.exit(0);
    }

    const backupDir = `/tmp/${appName}_backup_${Date.now()}`;
    fs.renameSync(appDir, backupDir);
    console.log(chalk.yellow(`${emoji.check} Backup saved to ${backupDir}`));
  }

  console.log(
    chalk.blue(`${emoji.box} Creating ${stackConfig.title} app: ${appName}`)
  );

  switch (selectedStack) {
    case "react":
      await execa("npx", ["create-react-app", appName], { stdio: "inherit" });
      break;
    case "react-native":
      await execa("npx", ["react-native", "init", appName], {
        stdio: "inherit",
      });
      break;
    case "flutter":
      await execa(
        "flutter",
        [
          "create",
          appName,
          "--org",
          "com.example",
          "-a",
          "kotlin",
          "-i",
          "swift",
        ],
        { stdio: "inherit" }
      );
      // Fix Gradle files after creation
      await fixFlutterGradleFiles(appDir, "com.example");
      break;
    case "springboot":
      fs.mkdirSync(appName);
      process.chdir(appName);
      await execa(
        "curl",
        ["https://start.spring.io/starter.zip", "-o", "starter.zip"],
        { stdio: "inherit" }
      );
      await execa("unzip", ["starter.zip"], { stdio: "inherit" });
      fs.rmSync("starter.zip");
      break;
    case "nest":
      await execa("npx", ["@nestjs/cli", "new", appName], { stdio: "inherit" });
      break;
    case "node":
      fs.mkdirSync(appName);
      process.chdir(appName);
      await execa("npm", ["init", "-y"], { stdio: "inherit" });
      break;
    case "python":
      fs.mkdirSync(appName);
      fs.writeFileSync(
        path.join(appName, "main.py"),
        "# Start your Python app here\n"
      );
      break;
  }

  const { open } = await inquirer.prompt({
    type: "confirm",
    name: "open",
    message: "💻 Open in VS Code?",
    default: true,
  });

  if (open) {
    await execa("code", [appName]);
  }

  console.log(
    chalk.green.bold(
      `${emoji.check} Done! ${appName} is ready to build. Happy hacking! 🔥`
    )
  );
}

main();
