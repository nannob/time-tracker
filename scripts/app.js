(function() {
	'use strict';
	var app = angular.module('timeTracker', [ 'ngResource', 'ui.bootstrap', 'datamcflyResourceHttp' ])
		.constant('DATAMCFLY_CONFIG',{API_KEY:'your key goes here', DB_NAME:'your app name goes here'})
		.factory('time', time)
		.controller('TimeEntry', TimeEntry);

	function time( $datamcflyResourceHttp ) {
		var Time = $datamcflyResourceHttp('time');
		
		function getTime() {
			var results = Time.all();
			angular.forEach(results, function(result) {
				result.loggedTime = getTimeDiff(result.start_time, result.end_time);
			});
			return results;
		}
		
		function datamcfly(){
			return Time.datamcfly();
		}
		
		function getTimeDiff(start, end) {
			var diff = moment(end).diff(moment(start));
			var duration = moment.duration(diff);
			return {
				duration: duration
			}
		}
		
		function getTotalTime(timeentries) {
			var totalMilliseconds = 0;
			angular.forEach(timeentries, function(key) {
				key.loggedTime = getTimeDiff(key.start_time, key.end_time)
				totalMilliseconds += key.loggedTime.duration._milliseconds;
			});
			return {
				hours: moment.duration(totalMilliseconds).hours(),
				minutes: moment.duration(totalMilliseconds).minutes()
			}
		}

		return {
			datamcfly: datamcfly,
			getTime: getTime,
			getTimeDiff: getTimeDiff,
			getTotalTime: getTotalTime,
		}
	}
	
	
	function TimeEntry(time) {
	
		var vm = this;
		
		// Initialize the clockIn and clockOut times to the current time.
		vm.clockIn = moment();
		vm.clockOut = moment();

		vm.timeentries = [];
		
		vm.totalTime = {};
		
		time.getTime().then(function(results) {
			vm.timeentries = results;
			updateTotalTime(vm.timeentries);
		});
		
		function updateTotalTime(timeentries) {
			vm.totalTime = time.getTotalTime(timeentries);
		}
		
		vm.logNewTime = function() {

			if(vm.clockOut < vm.clockIn) {
				alert("You can't clock out before you clock in!");
				return;
			}
			time.datamcfly().push({
				"user_id":1,
				"user_firstname":"Roger",
				"user_lastname":"Stringer",
				"start_time":vm.clockIn,
				"end_time":vm.clockOut,
				"project_id":1,
				"project_title":"Project 1",
				"loggedTime": time.getTimeDiff(vm.clockIn, vm.clockOut),
				"comment":vm.comment
			}, function(data){
				console.log('Insert Documents : ', data);
			});
			updateTotalTime(vm.timeentries);
			
			vm.comment = "";
		}
	
		time.datamcfly().on('added', function( data ){
			time.getTime().then(function(results) {
				vm.timeentries = results;
				updateTotalTime(vm.timeentries);
			});
		});

		time.datamcfly().on('changed', function( data ){
			time.getTime().then(function(results) {
				vm.timeentries = results;
				updateTotalTime(vm.timeentries);
			});
		});

		time.datamcfly().on('removed', function( data ){
			time.getTime().then(function(results) {
				vm.timeentries = results;
				updateTotalTime(vm.timeentries);
			});
		});	
	}

})();