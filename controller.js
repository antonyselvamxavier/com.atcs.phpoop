angular.module("atcapp", [])
.controller("flightController", function($scope,$http){
    $scope.flights = [];
    $scope.tempflightData = {};
    $scope.flighttypes=["1.Emergency","2.VIP","3.Passenger","4.Cargo"];
    $scope.flightsizes=["1.Large","2.Small"];
    $scope.IsVisible = false;

    $scope.ShowHide = function(){
            $scope.IsVisible = true;
        }
    $scope.HideShow = function(){
            $scope.IsVisible = false;
        }
    // function to get flight records from the database
    $scope.getflightRecords = function(){
        $http.get('com.fun.php', {
            params:{
                'type':'view'
            }
        }).success(function(response){
            if(response.status == 'OK'){
                $scope.flights = response.records;
            }
        });
    };
    
    // function to enqueue or modify enqueued flight data to the database
    $scope.saveflight = function(type){
        var data = $.param({
            'data':$scope.tempflightData,
            'type':type
        });
        var config = {
            headers : {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            }
        };
        $http.post("com.fun.php", data, config).success(function(response){
            if(response.status == 'OK'){
                if(type == 'edit'){
                    $scope.flights[$scope.index].id = $scope.tempflightData.id;
                    $scope.flights[$scope.index].FlightID = $scope.tempflightData.FlightID;
                    $scope.flights[$scope.index].FlightType = $scope.tempflightData.FlightType;
                    $scope.flights[$scope.index].FlightSize = $scope.tempflightData.FlightSize;
                    $scope.flights[$scope.index].created = $scope.tempflightData.created;
                }else{
                    $scope.flights.push({
                        id:response.data.id,
                        FlightID:response.data.FlightID,
                        FlightType:response.data.FlightType,
                        FlightSize:response.data.FlightSize,
                        created:response.data.created
                    });
                    
                }
                $scope.flightForm.$setPristine();
                $scope.tempflightData = {};
                $('.formData').slideUp();
                $scope.messageSuccess(response.msg);
            }else{
                $scope.messageError(response.msg);
            }
        });
    };
    
    // function to Enqueue Flight data
    $scope.EnqueueFlight = function(){
        $scope.saveflight('Enqueue');
    };
    
    // function to edit flight enqueued data
    $scope.editflight = function(flight){
        $scope.tempflightData = {
            id:flight.id,
            FlightID:flight.FlightID,
            FlightType:flight.FlightType,
            FlightSize:flight.FlightSize,
            created:flight.created
        };
        $scope.index = $scope.flights.indexOf(flight);
        $('.formData').slideDown();
    };
    
    // function to update Enqueued flight data
    $scope.updateflight = function(){
        $scope.saveflight('edit');
    };
    
    // function to Dequeue flight data from the database
    $scope.dequeueflight = function(flight){
        var conf = confirm('Are you sure to dequeue the flight?');
        if(conf === true){
            var data = $.param({
                'id': flight.id,
                'type':'dequeue'    
            });
            var config = {
                headers : {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }    
            };
            $http.post("com.fun.php",data,config).success(function(response){
                if(response.status == 'OK'){
                    var index = $scope.flights.indexOf(flight);
                    $scope.flights.splice(index,1);
                    $scope.messageSuccess(response.msg);
                }else{
                    $scope.messageError(response.msg);
                }
            });
        }
    };
    //exit function dequeue all flights and empties the queue.
    $scope.exit = function() {
        var conf = confirm('Are you sure to exit from ATCS?');
        
        
        if(conf === true){
            var data = $.param({
                'type':'exit'    
            });
            var config = {
                headers : {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }    
            };
            $http.post("com.fun.php",data,config).success(function(response){
                if(response.status == 'OK'){
                    $scope.flights = [];
                    $scope.getflightRecords();
                    $scope.messageSuccess(response.msg);
                    $scope.HideShow();
                    
                    
                }else{
                    $scope.messageError(response.msg);
                }
            });
        }
        
    };
    
    // function to display success message
    $scope.messageSuccess = function(msg){
        $('.alert-success > p').html(msg);
        $('.alert-success').show();
        $('.alert-success').delay(5000).slideUp(function(){
            $('.alert-success > p').html('');
        });
    };
    
    // function to display error message
    $scope.messageError = function(msg){
        $('.alert-danger > p').html(msg);
        $('.alert-danger').show();
        $('.alert-danger').delay(5000).slideUp(function(){
            $('.alert-danger > p').html('');
        });
    };
});