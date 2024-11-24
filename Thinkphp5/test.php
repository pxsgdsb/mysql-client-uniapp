<?php
namespace app\dbbox\controller;
use think\Controller;
use app\index\controller\Api;
use think\Db;


// 数据库客户端
class Index extends Api{
    
    // 执行SQL语句
    public function executeSql(){
        // 获取数据库连接参数
        $db_id = I('db_id');
        $DbJoinInfo = model('DbJoinInfo');
        $config = $DbJoinInfo->getInfo($db_id,"all");
        if(!$config){
            return ajaxReturn('', '未查询到数据库！', 4001);
        }
        // 尝试连接
        $connectDb = $this->connectDb($config['type'],$config['hostname'],$config['database'],$config['username'],$config['password'],$config['hostport']);
        if($connectDb["status"]!=1){
            return ajaxReturn('', '数据库连接失败：' . $connectDb["err_msg"], 4001);
        }
        $connection = $connectDb["res"];
        // 执行SQL
        $base64_sql = I('base64_sql');
        $sql = base64url_decode($base64_sql);
        try {
            $result = $connection->query($sql);
            if($result===false){
                return ajaxReturn('', '执行失败:'.$connection->getError(), 4001);
            }
        } catch (\Exception $e) {
            return ajaxReturn("", '执行失败:'.$e->getMessage(), 4001);
        }
        return ajaxReturn($result, '成功', 1);

    }
    
    
    // 封装-连接数据库
    public function connectDb($type,$hostname,$database,$username,$password,$hostport,$test_sql=''){
        $config = [
            // 数据库类型
            'type'        => $type?$type:'mysql',
            // 数据库连接DSN配置
            'dsn'         => '',
            // 服务器地址
            'hostname'    => $hostname,
            // 数据库名
            'database'    => $database,
            // 数据库用户名
            'username'    => $username,
            // 数据库密码
            'password'    => $password,
            // 数据库连接端口
            'hostport'    => $hostport,
            // 数据库连接参数
            'params'      => [],
            // 数据库编码默认采用utf8
            'charset'     => 'utf8',
            // 数据库表前缀
            'prefix'      => '',
        ];
        try {
            $connection = Db::connect($config);
            if($test_sql){
                $result = $connection->query($test_sql);
                if(!$result){
                    return ["status"=>0,"res"=>"","err_msg"=>$connection->getError()];
                }
            }
            return ["status"=>1,"res"=>$connection];
        } catch (\Exception $e) {
            return ["status"=>0,"res"=>"","err_msg"=>$e->getMessage()];
        }
    }
}


