(function (angular, buildfire) {
    'use strict';
    if (!buildfire) {
        throw ("buildfire not found");
    }
    angular
        .module('socialModals', ['ui.bootstrap'])
        .factory('Modals', ['$modal', '$q', '$modalStack', function ($modal, $q, $modalStack) {
            return {
                showMoreOptionsModal: function (info, callback) {
                    var moreOptionsPopupDeferred = $q.defer();
                    var showMoreOptionModal = $modal
                        .open({
                            templateUrl: 'templates/modals/more-options-modal.html',
                            controller: 'MoreOptionsModalPopupCtrl',
                            controllerAs: 'MoreOptionsPopup',
                            size: 'sm',
                            resolve: {
                                Info: function () {
                                    return info;
                                }
                            }
                        });
                    showMoreOptionModal.result.then(function (imageInfo) {
                        moreOptionsPopupDeferred.resolve(imageInfo);
                    }, function (err) {
                        //do something on cancel
                        moreOptionsPopupDeferred.reject(err);
                    });
                    return moreOptionsPopupDeferred.promise;
                },
                showMoreOptionsCommentModal: function (info, callback) {
                    var moreOptionsPopupDeferred = $q.defer();
                    var showMoreOptionModal = $modal
                        .open({
                            templateUrl: 'templates/modals/more-options-comment-modal.html',
                            controller: 'MoreOptionsCommentModalPopupCtrl',
                            controllerAs: 'MoreOptionsPopup',
                            size: 'sm',
                            resolve: {
                                Info: function () {
                                    return info;
                                }
                            }
                        });
                    showMoreOptionModal.result.then(function (imageInfo) {
                        moreOptionsPopupDeferred.resolve(imageInfo);
                    }, function (err) {
                        //do something on cancel
                        moreOptionsPopupDeferred.reject(err);
                    });
                    return moreOptionsPopupDeferred.promise;
                },
                close: function(reason) {
                    $modalStack.dismissAll(reason);
                }
            };
        }])
        .controller('MoreOptionsModalPopupCtrl', ['$scope', '$modalInstance', 'Info','$rootScope','SocialDataStore','Buildfire', function ($scope, $modalInstance, Info,$rootScope,SocialDataStore,Buildfire) {
            console.log('MoreOptionsModalPopup Controller called-----');
            var MoreOptionsPopup=this;
            MoreOptionsPopup.option='';
            MoreOptionsPopup.options=['Report Post'];

            $scope.postId=Info.postId;
            $scope.userId=Info.userId;
            $scope.socialItemUserId=Info.socialItemUserId;

            $scope.ok = function (option) {
                $modalInstance.close(option);
            };
            $scope.cancel = function () {
                $modalInstance.dismiss('no');
            };

            $scope.block = function () {
                console.log('block called');

            };

            $scope.deletePost=function(postId){
                var deletePostPromise=SocialDataStore.deletePost(postId);
                deletePostPromise.then(function(response){
                    var event={};
                    event.name="POST_DELETED";
                    event._id=postId;
                    Buildfire.messaging.onReceivedMessage(event);
                    $modalInstance.dismiss('no');
                    console.log(response);
                },function(err){
                    $modalInstance.dismiss('no');
                    console.log(err);
                })

            };

            $scope.blockUser = function(){
                $modalInstance.close('Block User');
            };
        }])
        .controller('MoreOptionsCommentModalPopupCtrl', ['$scope', '$modalInstance', 'Info','$rootScope','SocialDataStore','Buildfire', function ($scope, $modalInstance, Info,$rootScope,SocialDataStore,Buildfire) {
            console.log('MoreOptionsModalPopup Controller called-----');
            var MoreOptionsPopup=this;

            $scope.commentId=Info.commentId;

            $scope.ok = function (option) {
                $modalInstance.close(option);
            };
            $scope.cancel = function () {
                $modalInstance.dismiss('no');
            };

            $scope.block = function () {
                console.log('block called');

            };

            $scope.deleteComment=function(commentId){
                $rootScope.$emit('Delete-Comment',{'commentId':commentId})
                $modalInstance.close();
            }
        }])
        .controller('MoreOptionsBlockModalPopupCtrl', ['$scope', '$modalInstance', 'Info','$rootScope','SocialDataStore','Buildfire', function ($scope, $modalInstance, Info,$rootScope,SocialDataStore,Buildfire) {
            $scope.blockUserId = Info.blockUserId;

            $scope.ok = function (option) {
                $modalInstance.close(option);
            };
            $scope.cancel = function () {
                $modalInstance.dismiss('no');
            };

            $scope.blockUser =function(){
                var blockUserPromise = SocialDataStore.blockUser($scope.blockUserId);
                blockUserPromise.then(function(response){
                    var event={};
                    event.name = "USER_BLOCKED";
                    event._id = $scope.blockUserId;
                    Buildfire.messaging.onReceivedMessage(event);
                    $modalInstance.dismiss('no');
                    console.log(response);
                },function(err){
                    $modalInstance.dismiss('no');
                    console.log(err);
                })

            };
        }])
})(window.angular, window.buildfire);
