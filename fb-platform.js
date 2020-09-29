var preloadedRewardedVideo = null
var preloadedRewardedInterstitial = null

class FbPlatform {
    getType() {
        return "fb"
    }

    getModel() {
        return new Promise((resolve, reject) => {
            resolve({
                brand: "",
                model: "",
                version: "",
                appName: "",
                system: "",
                platform: "",
                benchmarkLevel: "",
            })
        })
    }

    login() {
        return new Promise(function (resolve, reject) {
            FBInstant.player.getSignedPlayerInfoAsync()
                .then(function (result) {
                    var playerId = result.getPlayerID()

                    console.log("login: ", playerId)
                    resolve({errcode: parseInt(0), account: playerId})
                })
                .catch(function (reason) {
                    console.error(reason)
                })
        })
    }

    getUserInfo() {
        return new Promise(function (resolve, reject) {
            console.log("getUserInfo: ", FBInstant.player)
            resolve({
                nickname: FBInstant.player.getName(),
                avatar: FBInstant.player.getPhoto(),
            })
        })
    }

    exitGame() {
        FBInstant.quit()
    }
    
    createBanner(adUnitId) {
    }

    showBanner(bannerAd) {
    }

    hideBanner(bannerAd) {
    }

    createVideoAd(adUnitId) {
        console.log("createVideoAd adUnitId: ", adUnitId)
        FBInstant.getRewardedVideoAsync(
          adUnitId, // Your Ad Placement Id
        ).then(function(rewarded) {
            // Load the Ad asynchronously
            preloadedRewardedVideo = rewarded
            console.log("createVideoAd: ", rewarded)
            return preloadedRewardedVideo.loadAsync()
        }).then(function() {
            console.log('Rewarded video preloaded')
        }).catch(function(err){
            console.error('Rewarded video failed to preload: ', err)
        })
    }

    loadRewardedVideoAd(callback1, callback2) {
        return new Promise(function (resolve, reject) {
            if (!preloadedRewardedVideo) {
                console.log("loadRewardedVideoAd error: null")
                callback1(99)
                resolve(-1)
                return
            }
            callback1(0)
            preloadedRewardedVideo.showAsync()
            .then(function() {
                // Perform post-ad success operation
                console.log('Rewarded video watched successfully')
                callback2(true)
                resolve(0)
            })
            .catch(function(e) {
                console.error("Rewarded video watched failed: ", e)
                callback2(false)
                resolve(e.code)
            })
        })
    }
    
    createChaping(adUnitId) {
        FBInstant.getInterstitialAdAsync(
            adUnitId,
        ).then(function(interstitial) {
            preloadedRewardedInterstitial = interstitial
            return preloadedRewardedInterstitial.loadAsync()
        }).then(function() {
            console.log('Rewarded interstitial preloaded')
        }).catch(function(err){
            console.error('Rewarded interstitial failed to preload: ', err)
        })
    }
    
    showChaping() {
        if (!preloadedRewardedInterstitial) {
            console.log("loadRewardedInterstitial error: null")
            return
        }
        preloadedRewardedInterstitial.showAsync()
        .then(function() {
            // Perform post-ad success operation
            console.log('Rewarded interstitial watched successfully')
        })
        .catch(function(e) {
            console.error("Rewarded interstitial watched failed: ", e)
        })
    }

    initVideoRecord(callback, callback2) {
    }

    startVideoRecord() {
    }

    stopVideoRecord() {
    }

    onShare(title, url) {
    }
	
	share(text, imageData) {
		FBInstant.shareAsync({
			intent: 'SHARE',
			image: imageData,
			text: text,
			data: {},
		})
	}
    
    navigateToMiniProgram(id) {
    }
    
    previewImage(url) {
    }

    startGameAsync() {
        return new Promise(function (resolve, reject) {
            FBInstant.startGameAsync()
                .then(function() {
                    resolve(0)
                })
        })
    }

    initializeAsync() {
        return new Promise(function (resolve, reject) {
            FBInstant.initializeAsync()
                .then(function() {
                    resolve(0)
                })
        })
    }

    getSupportedAPIs() {
        return new Promise(function (resolve, reject) {
            var supportedAPIS = FBInstant.getSupportedAPIs()
            console.log("supportedAPIS: ", supportedAPIS)
            resolve(supportedAPIS)
        })
    }
    
    getMyRank(callback) {
        FBInstant.getLeaderboardAsync('global_board')
            .then(function(leaderboard) {
                return leaderboard.getPlayerEntryAsync();
            })
            .then(function(entry) {
                if (!entry) {
                    console.log("no my rank")
                    callback(null, 0)
                }
                else {
                    console.log("getMyRank: ", entry.getRank(), entry.getScore())
                    callback(entry.getRank(), entry.getScore())
                }
            });
    }
    
    updateScore(score) {
        FBInstant.getLeaderboardAsync('global_board')
            .then(function(leaderboard) {
                return leaderboard.setScoreAsync(score);
            })
    }
    
    getRank(callback) {
        FBInstant
            .getLeaderboardAsync('global_board')
            .then(leaderboard => leaderboard.getEntriesAsync(30, 0))
            .then(entries => {
                if (!entries) {
                    callback([])
                }
                else {
                    var list = []
                    for (var i = 0; i < entries.length; i++) {
                        var rank = entries[i].getRank()
                        var nickname = entries[i].getPlayer().getName()
                        var score = entries[i].getScore()
                        list[rank-1] = {
                            nickname: nickname,
                            score: score,
                        }
                    }
                    console.log("getRank: ", list)
                    callback(list)
                }
            }).catch(error => console.error(error));
    }
    
    navigateToMiniProgram(id, callback1, callback2) {
        if (callback1) {
            callback1()
        }
        FBInstant.switchGameAsync(id).catch(function (e) {
            // Handle game change failure
            console.log("switch fail: ", id, e)
            if (callback2) {
                callback2()
            }
        });
    }
}

window.platform = new FbPlatform()
console.log("platform: fb")