<?php
include 'com.db.php';
$db = new DB();
$tblName = 'dbFlights';
if(isset($_REQUEST['type']) && !empty($_REQUEST['type'])){
    $type = $_REQUEST['type'];
    switch($type){
        case "view":
            $records = $db->getRows($tblName);
            if($records){
                $data['records'] = $db->getRows($tblName);
                $data['status'] = 'OK';
            }else{
                $data['records'] = array();
                $data['status'] = 'ERR';
            }
            echo json_encode($data);
            break;
        case "Enqueue":
            if(!empty($_POST['data'])){
                $flightData = array(
                    'FlightID' => $_POST['data']['FlightID'],
                    'FlightType' => $_POST['data']['FlightType'],
                    'FlightSize' => $_POST['data']['FlightSize']
                );
                $enqueue = $db->enqueue($tblName,$flightData);
                if($enqueue){
                    $data['data'] = $enqueue;
                    $data['status'] = 'OK';
                    $data['msg'] = 'Aircraft enqueued successfully.';
                }else{
                    $data['status'] = 'ERR';
                    $data['msg'] = 'Some problem occurred, please try again.';
                }
            }else{
                $data['status'] = 'ERR';
                $data['msg'] = 'Some problem occurred, please try again.';
            }
            echo json_encode($data);
            break;
        case "edit":
            if(!empty($_POST['data'])){
                $flightData = array(
                    'FlightID' => $_POST['data']['FlightID'],
                    'FlightType' => $_POST['data']['FlightType'],
                    'FlightSize' => $_POST['data']['FlightSize']
                );
                $condition = array('id' => $_POST['data']['id']);
                $update = $db->update($tblName,$flightData,$condition);
                if($update){
                    $data['status'] = 'OK';
                    $data['msg'] = 'Enqueued Aircraft updated successfully.';
                }else{
                    $data['status'] = 'ERR';
                    $data['msg'] = 'Some problem occurred, please try again.';
                }
            }else{
                $data['status'] = 'ERR';
                $data['msg'] = 'Some problem occurred, please try again.';
            }
            echo json_encode($data);
            break;
        case "dequeue":
            if(!empty($_POST['id'])){
                $condition = array('id' => $_POST['id']);
                $dequeue = $db->dequeue($tblName,$condition);
                if($dequeue){
                    $data['status'] = 'OK';
                    $data['msg'] = 'Aircraft successfully Dequeued.';
                }else{
                    $data['status'] = 'ERR';
                    $data['msg'] = 'Some problem occurred, please try again.';
                }
            }else{
                $data['status'] = 'ERR';
                $data['msg'] = 'Some problem occurred, please try again.';
            }
            echo json_encode($data);
            break;
        case "exit":
                $exited = $db->dequeueall($tblName);
                if($exited){
                    $data['status'] = 'OK';
                    $data['msg'] = 'All Aircrafts are successfully Dequeued.';
                }else{
                    $data['status'] = 'ERR';
                    $data['msg'] = 'Some problem occurred, please try again.'.$exited;
                }
            
            echo json_encode($data);
            break;
        default:
            echo '{"status":"INVALID"}';
    }
}