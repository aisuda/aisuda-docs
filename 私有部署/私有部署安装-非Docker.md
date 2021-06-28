# 非 Docker 模式安装

如果无法使用 Docker，爱速搭也能直接在机器上运行。

### 环境准备

环境准备需要

1. 下载 [NodeJS](https://nodejs.org/en/download/)，推荐使用 v14 版本。
2. 下载 [MySQL](https://dev.mysql.com/downloads/mysql/)，具体取决于系统，如果是源码安装推荐下载带 `Boost Headers` 的版本，版本最小要求是 5.7
3. [Redis](https://redis.io/download)（可选，如果已经有安装就不需要）。

4. 下载 aisuda 最新版本：
   
   ### 安装Docker
   以Mac上安装Docker为例，打开[Mac](https://docs.docker.com/docker-for-mac/install/)链接。
   #### 下载安装包
   ![image](https://user-images.githubusercontent.com/80095014/123589768-4730da80-d81c-11eb-99ea-49eed7e05c93.png)
   ![image](https://user-images.githubusercontent.com/80095014/123589785-4e57e880-d81c-11eb-90e6-b30dcf170bf0.png)
   ```bash
   docker run --rm -it --name aisuda registry.baidubce.com/aisuda/aisuda:1.1.13 bash
   ![image](https://user-images.githubusercontent.com/13377023/123605551-8b2cdb00-d82e-11eb-9f6f-5c7010900981.png)
   ```
   ![image](https://user-images.githubusercontent.com/13377023/123614667-1dd17800-d837-11eb-838b-8e70de77abe4.png)
   ```
   # 新开一个命令行终端，运行如下命令将爱速搭中的代码拷贝到本地
   docker cp aisuda:/app app
   ```
   ![image](https://user-images.githubusercontent.com/13377023/123614989-71dc5c80-d837-11eb-9fa3-e241e0936177.png)
   将这个app目录压缩后 拷贝到需要安装的机器

## 基础依赖安装

1. 安装 Node，可以通过 `tar --strip-components 1 -xf node-v* -C /usr/local` 全局安装，或者 `tar -xf node-v*` 解压到本地目录，然后修改 `~/.bash_profile` 将路径加入到 `PATH` 中。
   ![image](https://user-images.githubusercontent.com/13377023/123604018-04c3c980-d82d-11eb-816e-7ff82dbcb4d2.png)

   ![image](https://user-images.githubusercontent.com/13377023/123602035-eeb50980-d82a-11eb-8c07-f92982702f09.png)


2. 下面是编译和安装 Redis 及 MySQL，如果有对应的服务也可以不安装

   1. 确保机器上有 `gcc`，没有就安装基础编译环境 `yum group install -y "Development Tools"`。
   2. 下载Redis
   ![image](https://user-images.githubusercontent.com/13377023/123614185-ad2a5b80-d836-11eb-9d5d-b9b242667b40.png)

   3. Redis，解压 `tar xzf redis*`，使用如下命令编译和启动

      ```bash
      make
      nohup src/redis-server &
      ```
   ![image](https://user-images.githubusercontent.com/13377023/123602944-ead5b700-d82b-11eb-83f0-92e899dbf9fd.png)

   4. MySQL，下面是 Centos 系统下源码方式安装，也可以根据实际情况换成别的方式。
   
   ```bash
   yum install -y cmake openssl-devel ncurses-devel
   groupadd mysql
   useradd -r -g mysql -s /bin/false mysql
   tar zxf mysql-boost-5.7.33.tar.gz
   cd mysql-5.7.33
   mkdir bld
   cd bld
   cmake .. -DDOWNLOAD_BOOST=1 -DWITH_BOOST=../boost/
   make -j4
   make install
   cd /usr/local/mysql
   mkdir mysql-files
   chown mysql:mysql mysql-files
   chmod 750 mysql-files
   ./bin/mysqld --initialize --user=mysql
   # 需要留意上个命令生成的 root 密码
   ./bin/mysqld_safe --user=mysql --character-set-server=utf8mb4 --collation-server=utf8mb4_unicode_ci --skip-character-set-client-handshake --default-authentication-plugin=mysql_native_password --max-allowed-packet=1073741824 --sort-buffer-size=512K --max-connections=4096 &
   # 使用刚才的密码登录
   /usr/local/mysql/bin/mysql -uroot -p'xxx'
   
   # 修改 root 密码
   alter user 'root'@'localhost' identified by '123456';
   FLUSH PRIVILEGES;
   # 创建 aisuda 数据库
   CREATE DATABASE aisuda CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
   不同系统安装mysql方式不一致，这里示例为mysql环境ready后创建 user和database;
   ![image](https://user-images.githubusercontent.com/13377023/123615807-3b531180-d838-11eb-8994-1775c3893f31.png)

## 爱速搭项目启动

之前拷贝的爱速搭程序 `app.tar.gz` 文件解压 `tar xzf app.tar.gz`。如果copy过来是没解压的文件

创建 `start.sh` 文件，加入环境变量，参考前面的说明，但需要注意在这里的环境变量写法是类似如下：

```bash
# 端口控制
export PORT=8089
# 下面是用于调试的选项
# export YOG_ENV=dev
# export NODE_ENV=dev
export ISUDA_DB_USER=root
export ISUDA_DB_PASSWORD=123456
export ISUDA_DB_NAME=aisuda
export ISUDA_DB_HOST=localhost
export ISUDA_DB_PORT=5432
export ISUDA_REDIS_HOST=localhost
export ISUDA_REDIS_PORT=6379
export ISUDA_LICENSE=xxx
# 下面是自定义组件的地址，也可以将爱速搭项目放在本地 `/app` 目录下，就无需下面的配置
# export CUSTOM_COMPONENT_TS_DIR=/xxx/xxx/ts4.1.2
node app.js
```

最后通过 `bash start.sh` 运行。
![image](https://user-images.githubusercontent.com/13377023/123615949-5de52a80-d838-11eb-9d5a-b9c18343f91e.png)


如果确认成功运行，关掉这个进程后，将 `start.sh` 里的 `node app.js` 改成 `./node_modules/.bin/pm2 start app/amis-saas/pm2.json`，然后再次运行 `bash start.sh`。
![image](https://user-images.githubusercontent.com/13377023/123603048-0771ef00-d82c-11eb-85d8-baa7d905ceee.png)
接着访问 <http://localhost:8090/> 就可以看到安装界面，按照引导执行。
![image](https://user-images.githubusercontent.com/80095014/123610212-f9739c80-d832-11eb-9172-8e34bc04e095.png)
![image](https://user-images.githubusercontent.com/80095014/123610273-055f5e80-d833-11eb-84c5-1ffdc344f24b.png)
![image](https://user-images.githubusercontent.com/80095014/123610285-08f2e580-d833-11eb-9572-015c5efb4028.png)
![image](https://user-images.githubusercontent.com/80095014/123610342-14dea780-d833-11eb-833b-7ef6b40451f1.png)
