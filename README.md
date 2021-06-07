# packaging-script

## dev
```
yarn 

yarn link

// You can now run `yarn link "packaging-scripts"` in the projects where you want to use this package and it will be used instead.
yarn link "packaging-scripts"

package-scripts start or package-scripts build
```

## .defaultrc.json 
自定义 webpack 配置

字段 | 默认值 | 描述
----------- | ----------- | -----------
appPath        |src             |  入口地址
appEnter       |./src/index.tsx | 入口文件
appOutputRoot          |dist            | 出口文件
useStylelint       |false           | 开启的话，就需要在根目录存放 stylelint.config.js
stylelintConfig    | ./stylelint.config.js | 需要和 useStylelint 一起使用
useDefaultTsConfig | false  | 是否采用 typescript 进行编程，如果为 true，项目中需要添加 tsconfig.json 文件