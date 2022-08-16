import axios from '@/axios'
import qs from 'qs'
import { getDate,getCodeState,setSession,setDate2 } from '@/common/common'
import { Toast } from 'vant'

export default {
    // 开启命名空间
    namespaced: true,
    // 登录前弹窗
    indexPopup: false,
    state: {
        //会话窗口
        chatList:[],
        friendsList:[], //好友列表
        teamsList:[], //群列表
        msgs:[], //会话列表
        currentChat:{},
        chatMessage:{
            myInfo:{}
        },
        //当前选中信息
        currentMessageList:[],
        currentChatInfo:{},
        //群成员
        TeamMembers:[],
        currentMemberInfo:{},
        //我在群里的身份信息
        myIdentity:{},
        userCard:{},
        notFriends:[],
        sysMsg:[],
        blacklist:[],
        teamChatList:[]
    },
    mutations: {
        resetVuex(state,data) {
            state.chatList = []
            state.friendsList=[]//好友列表
            state.teamsList=[] //群列表
            state.msgs=[]
            state.currentChat={}
            state.chatMessage={}
                //当前选中信息
            state.currentMessageList=[]
            state.currentChatInfo={}
            //群成员
            state.TeamMembers=[]
            state.currentMemberInfo={}
            //我在群里的身份信息
            state.myIdentity={}
            state.userCard={}
            state.notFriends=[]
            state.sysMsg=[]
            state.blacklist=[]
            state.teamChatList=[]
        },
        setTeamChatList(state,data) {
            state.teamChatList = data
        },
        updateSendMsgStatus(state,data) {
            // console.log('updateSendMsgStatus111---',data.status);
            let idx = state.currentMessageList.findIndex(item=>item.idClient === data.idClient)
            state.currentMessageList.splice(idx,1,data)
        },
        setBlacklistNull(state) {
            state.blacklist = []
        },
        setRemoveBlackList(state,data) {
            let friendsArr = []
            state.chatMessage.friends.map(v=>{
                friendsArr.push(v.account)
            })
            state.blacklist.map(dd=>{
                if(friendsArr.includes(data.account)) { //如果好友在黑名单 加入好友列表
                    state.friendsList.push(dd)
                }
            })

            let idx = state.blacklist.findIndex(item =>item.account === data.account)
            if(idx !== undefined) {
                state.blacklist.splice(idx,1)
            }

        },
        setBlacklist(state,data) { //加入黑名单
            if(state.msgs.length > 0) { //加入黑名单的人 在会话列表则删掉该会话
                let sessionArr = []
                state.msgs.map(v=>{sessionArr.push(v.to)})
                if(sessionArr.includes(data.account)) {
                    let ids = state.msgs.findIndex(vv=>vv.to === data.account)
                    state.msgs.splice(ids,1)
                }
            }
            state.blacklist = state.blacklist.concat(data)
            //如果在好友列表则移除好友列表
            if(state.friendsList.length > 0) {
                state.friendsList.splice(state.friendsList.findIndex((itm,idx)=>itm.account === data.account),1)
            }
        },
        setMyInfo(state,data) {
            state.chatMessage.myInfo = Object.assign({},state.chatMessage.myInfo,data)
        },
        pushMsg(state,data) { //推送消息
            // console.log('dddd',data);
            // console.log('state.currentChatInfo.account',state.currentChatInfo.account);
            if(state.currentChatInfo.account) {
                if(data.to === state.currentChatInfo.account) {
                    state.currentMessageList.push(data)
                }
            }
        },
        deleteMsgs(state,data) {
            state.currentMessageList.map((item,idx)=>{
                if(item.idClient === data.idClient) {
                    state.currentMessageList.splice(idx,1)
                }
            })
        },
        setSysMsgs(state,data) {
            state.sysMsg = data

            data.map(item=>{
                if(item.type === 'deleteMsg' && item.status === 'success') { //撤回
                    state.currentMessageList.map((v,i)=>{
                        if(v.idClient === item.msg.idClient) {
                            state.currentMessageList.splice(i,1)
                        }
                    })
                }
                // if(item.type === 'deleteFriend' && item.status === 'success') { //删除好友
                //     let idx = state.chatMessage.friends.findIndex(v=>v.account === item.to)
                //     state.chatMessage.friends.splice(idx,1)
                // }
                // if(item.type === 'addFriend' && item.status === 'success') { //添加好友
                //     let idx = state.chatMessage.friends.findIndex(v=>v.account === item.to)
                //     state.chatMessage.friends.unshift(item.friend)
                // }
            })
        },
        setNotFriendsNull(state) {
            state.notFriends = []
        },
        setSysMsgUnreadNull(state) {
            if(state.chatMessage.sysMsgUnread) {
                state.chatMessage.sysMsgUnread = null
            }
        },
        setNotFriends(state,data) {
            state.notFriends = state.notFriends.concat(data)
        },
        setUserCardNull(state) {
            state.userCard = {}
        },
        onAddFriend(state,data) { //添加好友
            // console.log("添加好友！",data);
            state.friendsList.push(data)
        },
        onDeleteFriend(state,data) { //删除好友
            // console.log('删除好友');
            state.friendsList.splice(state.friendsList.findIndex((itm,idx)=>itm.account === data),1)
        },
        onUpdateFriend(state,data) { //更新好友
            state.friendsList.map(item=>{
                if(item.account === data.account) {
                    item.alias = data.alias
                    state.userCard.alias = data.alias
                }
            })
        },
        setTeamUserCard(state,data) { //设置群用户名片
            state.userCard = data
        },
        setUserCard(state,data) { //设置用户名片
            if(data.account) {
                let fd = state.friendsList.filter(v=> v.account === data.account)
                if(fd.length === 1) {
                    state.userCard = fd[0]
                }else {
                    state.userCard = data
                }
            }
        },
        setTeamMuteStatus(state,data) { //设置群禁言状态
            let status = ""
            data === 1 ? status = true:status = false
            state.currentChatInfo.mute = status

            if(state.currentChatInfo.mute) { //禁言
                if(state.currentChatInfo.muteType === 'normal') { //禁言普通群员
                    state.TeamMembers.members.map(item =>{
                        if(item.type==='normal') {
                           item.mute = true
                        }
                    })
                }
            }

            if(!state.currentChatInfo.mute) { //解除禁言
                if(state.currentChatInfo.muteType === 'normal') {
                    state.TeamMembers.members.map(item => {
                        if (item.type==='normal') {
                            item.mute = false
                        }
                    })
                }
            }
        },
        setAnnouncement(state,data) {
            // console.log('fff',data.team.announcement);
            state.currentChatInfo.announcement = data.team.announcement
        },
        setManagerStatus(state,data) { //设置管理员
            // console.log('setManagerStatus',data);
            // let status = ""
            // data.mute === 0 ?  status = false: data.mute === 1 ?status = true:null
            // state.currentMemberInfo.mute = status
        },

        setMuteStatus(state,data) { //设置禁言状态
            let status = ""
            data.mute === 0 ?  status = false: data.mute === 1 ?status = true:null
            state.currentMemberInfo.mute = status
        },
        setDeleteSession(state,data) {
            if(data) {
                let idx = state.msgs.findIndex(item=>item.id === data)
                if(idx !== undefined) {
                    state.msgs.splice(idx,1)
                }
            }
        },
        setTeamMemberInfo(state,data) {
            state.currentMemberInfo = data
        },
        updateTeamInfo(state,data) {
            state.currentChatInfo = Object.assign(state.currentChatInfo,data.team)
        },
        setTeamMembers(state,data) {
            if(Array.isArray(data.members) && data.members.length > 0) {
                if(state.currentChatInfo.mute) { //禁言
                    if(state.currentChatInfo.muteType === 'normal') { //禁言普通群员
                        data.members.map(item =>{
                            if(item.type === 'normal') {
                                item.mute = true
                            }
                        })
                    }
                }
                if(!state.currentChatInfo.mute) { //解除禁言
                    if(state.currentChatInfo.muteType === 'normal') {
                        data.members.map(item => {
                            if (item.type !== 'owner' || item.type !== 'manager') {
                                item.mute = false
                            }
                        })
                    }
                }
            }
            for(let i in data.members) {
                if(state.chatMessage.myInfo.account === data.members[i].account ) {
                    state.myIdentity = data.members[i]
                }
            }
            state.TeamMembers = data
        },
        setCurrentChatInfo(state,data) {
            state.currentChatInfo = data
        },
        updateSessions(state,data) { //更新会话
            for(let i in state.msgs) {
                if(state.msgs[i].id === data.id) {
                    state.msgs[i] = data
                }
            }
            let isT = state.msgs.some(item=>item.id === data.id)
            if(!isT) {
                state.msgs.unshift(data)
            }else { //更新会话
                // console.log('dsssssssssssssssssss',data);
                // // let idx = state.currentMessageList.findIndex(v=>v.idClient === data.lastMsg.idClient)
                // // state.currentMessageList.splice(idx,1,data.lastMsg)
                // state.msgs[data.id] = data
            }

            if(data.lastMsg.attach && data.lastMsg.attach.type === 'dismissTeam') { //解散群不更新会话
                return
            }
            // addTeamMembers
            if(data.lastMsg.attach && data.lastMsg.attach.type === 'addTeamMembers') {//添加群
                state.currentChat = data
                if(data.id && state.chatMessage.msgs[data.id]) {
                    state.currentMessageList = state.chatMessage.msgs[data.id]
                }
            }
            if(data.lastMsg.attach && data.lastMsg.attach.type === 'leaveTeam') { //离开群 删除会话
                let myAccount = state.chatMessage.myInfo.account
                if(myAccount === data.lastMsg.attach.users[0].account) { //判断是否是我退群
                    let idx = state.msgs.findIndex(item=>item.id === data.id)
                    if(idx !== undefined) {
                        state.msgs.splice(idx,1)
                    }
                }
            }

            if((data.lastMsg.attach && data.lastMsg.attach.type === 'updateTeam') && (data.lastMsg.attach.team &&  data.lastMsg.attach.team.mute === true)) { //群禁言
                if(state.TeamMembers.members && Array.isArray(state.TeamMembers.members)) {
                    if(data.lastMsg.attach.team.muteType === 'normal') {  //none: 都不禁言; normal: 普通成员禁言，即普通成员不能发消息; all: 全体禁言，即所有成员均不能发消息禁言模式
                        state.TeamMembers.members.map(item=>{
                            if(item.type !== 'owner' || item.type !== 'manager') {
                                item.mute = true
                            }
                        })
                    }
                }
            }

            if((data.lastMsg.attach && data.lastMsg.attach.type === 'updateTeam') && (data.lastMsg.attach.team &&  data.lastMsg.attach.team.mute === false)) { //解除群禁言
                if(state.TeamMembers.members && Array.isArray(state.TeamMembers.members)) {
                    if(data.lastMsg.attach.team.muteType === 'none') {  //none: 都不禁言; normal: 普通成员禁言，即普通成员不能发消息; all: 全体禁言，即所有成员均不能发消息禁言模式
                        state.TeamMembers.members.map(item=>{
                            item.mute = false
                        })
                    }
                }
            }
        },
        setChatMessage(state,data) {
            state.chatMessage = data
            // state.msgs = data.msgs
            if(state.currentChat.id) { //更新
                setTimeout(()=>{
                    state.currentMessageList = data.msgs[state.currentChat.id]
                },20)
            }

        },
        setMsgs(state,data) {
            state.msgs = data
        },
        setCurrentChatNull(state) {
            state.currentChat = {}
            state.currentChatInfo = {}
            state.currentMessageList = []
        },
        setCurrentChat(state,data) {
            state.currentChat = data
            if(data.id && state.chatMessage.msgs[data.id]) {
                state.currentMessageList = state.chatMessage.msgs[data.id]
            }
        },
        // setCurrentMessageList(state,data) {
        //     state.currentMessageList = state.chatMessage.msgs[data.id]
        // },
        setChatList(state,data) {
            state.chatList = data
        },
        setTeamsList(state,data) {
            state.teamsList = data
        },
        updateTeamsList(state,data) {
            let idx = state.teamsList.findIndex(item=>item.teamId === data.teamId)
            if(idx !== undefined) {
                state.teamsList.splice(idx,1)
            }else {
                state.TeamMembers.members.concat(data.members)
            }
            // state.teamsList = data
        },
        removeTeamMembers(state,data) { //移除群聊通知
            if(data.accounts && Array.isArray(data.accounts)) {
                data.accounts.map(item=>{
                    if(item === state.chatMessage.myInfo.account) { //判断删除的是不是自己 如果是则删除该群聊
                        let index = state.teamsList.findIndex(v=>v.teamId === data.team.teamId)
                        state.teamsList.splice(index,1)

                        //删除会话
                        let idx = state.msgs.findIndex(itm=>itm.to === data.team.teamId)
                        state.msgs.splice(idx,1)
                    }
                })
            }
        },
        addTeamsList(state,data) {
            let isExist = state.teamsList.some(itm=>itm.teamId === data.team.teamId)
            if(!isExist) {
                state.teamsList.push(data.team)
            }
        },
        setFriendsList(state,data) {
            state.friendsList = data
        },
        mergeFriends(state,data) {
            // state.friendsList
            if((state.chatMessage.friends && state.chatMessage.friends.length > 0 ) && state.friendsList.length > 0) {
                if(state.chatMessage.friends.length === state.friendsList.length) {
                    state.chatMessage.friends.map((item,idx)=>{
                        if(item.alias) {//更新备注
                            state.friendsList.find((v,i)=>{
                                 if(item.account === v.account) {
                                     state.friendsList[i].alias = item.alias
                                 }
                             })
                        }
                    })
                }
            }
        },
    },
    actions: {},
    getters:{
        myInfo(state) {
           return state.chatMessage.myInfo
        }
    }
}
