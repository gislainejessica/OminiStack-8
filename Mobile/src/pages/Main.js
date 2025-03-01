import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Image, TouchableOpacity } from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';

import io from 'socket.io-client';
import api from '../services/api';

import logo from '../assets/logo.png';
import like from '../assets/like.png';
import dislike from '../assets/dislike.png';
import itsamatch from '../assets/itsamatch.png';
// http://localhost:7777  http://192.168.15.7:7777

export default function Main({navigation}){
   
    const [users, setUsers] =  useState([]);
    const id = navigation.getParam('user');
    const [matchDev, setmatchDev] = useState(false);

    useEffect ( () => {
        async function loadUSer(){
            const response = await api.get('/devs',{ 
                headers:{ user: id } })
            setUsers(response.data)
        }
        loadUSer();
    } ,[id])

    // Expert (Socket)
    useEffect( () => {
        const socket = io('http://192.168.15.7:7777', { 
            query: { 
                user: id 
            } 
        });
        console.log(socket)
        // Ouvindo o evento de Match
        socket.on('deuMatch', dev => { 
            setmatchDev(dev); 
        } );
        
     }, [id])

    async function handleLike(){
        const[user, ...rest] = users
        await api.post(`/devs/${user._id}/likes`, null, {
            headers:{ user:user._id},
        })
        setUsers(rest);
    }
    async function handleDislike(){
        const[user, ...rest] = users
        await api.post(`/devs/${user._id}/dislikes`, null, {
            headers:{ user:user._id},
        })
        setUsers(rest);
    }
    async function handleLogout(){
        await AsyncStorage.clear()
        navigation.navigate('Login')
    }
    return (
        <SafeAreaView style = {styles.container}>
            <TouchableOpacity onPress = {handleLogout}>
                <Image style = {styles.logo} source = {logo}/>
            </TouchableOpacity>
            <View style = {styles.cardContainer} > 
               { users.length > 0 
                ? users.map( (user,  index) => (
                    <View key = {user._id} style = {[styles.card, {zIndex: users.length - index}]}>
                        <Image style = {styles.avatar} source = {{uri: user.avatar}}/>
                        <View style = {styles.footer}>
                            <Text style = {styles.name}> {user.name} </Text>
                            <Text style = {styles.bio} numberOfLines = {3} > {user.bio}</Text>
                        </View>
                    </View>
                    )) 
                : ( <Text style = {styles.empty}> Acabou :-( </Text> )
                }
            </View>
            { users.length > 0 && (
                <View style = {styles.buttonsContainer}>
                    <TouchableOpacity style = {styles.button} onPress = {handleLike}>
                        <Image source = {like} />
                    </TouchableOpacity>
                    <TouchableOpacity style = {styles.button} onPress = {handleDislike}>
                        <Image source = {dislike}/>
                    </TouchableOpacity>
                </View>
            )}
           { matchDev && (
               <View  style = {styles.matchContainer}>
                   <Image style = {styles.matchImage} source = {itsamatch}  /> 
                   <Image  style = {styles.matchAvatar} source = {matchDev.avatar}  />
                   
                   <Text  style = {styles.matchName} > Nome:  {matchDev.name} </Text> 
                   <Text style = {styles.matchBio} > Bio:  {matchDev.bio} </Text> 
                  
                   <TouchableOpacity  onClick = { () => {
                                                setmatchDev(false) }
                    }> 
                        <Text  style = {styles.matchClose}> FECHAR </Text>
                   </TouchableOpacity>
               </View>
           )}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    logo:{
        marginTop: 30,
    },
    container:{
        flex:1,
        backgroundColor:'#F5F5F5',
        alignItems:'center',
        justifyContent:'space-between',
    },
    cardContainer:{
        flex:1,
        alignSelf:'stretch',
        justifyContent:'center',
        maxHeight:500,
    },
    card:{
        borderWidth:1,
        borderColor:'#DDD',
        borderRadius:8,
        margin:30,
        overflow:'hidden', 
        position:'absolute',
        top:0,
        left:0,
        right:0,
        bottom:0,
    },
    avatar:{
        flex:1, 
        height:300,
    },
    footer:{
        backgroundColor:'#FFF',
        paddingHorizontal: 20,
        paddingVertical:15,
    },
    name:{
        fontSize:16,
        fontWeight:'bold',
        color:"#333",
    },
    bio:{
        fontSize: 14,
        color: '#999',
        marginTop: 5,
        lineHeight: 18,
    },
    buttonsContainer:{
        flexDirection:'row',
        marginBottom:30,
    },
    button:{
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor:'#FFF', 
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 20,
        elevation: 2,

        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 2,
        shadowOffset:{
            width: 0,
            height: 2,
        },
    },
    empty:{
            alignSelf:'center',
            color:'#999',
            fontSize:24,
            fontWeight: 'bold',
    },
    matchContainer:{
        ...StyleSheet.absoluteFill,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent:'center',
        alignItems:'center',
    },
    matchImage:{
        height:60,
        resizeMode:'contain'
    },
    matchAvatar:{
        width:160,
        height:160,
        borderRadius:80,
        borderWidth:5,
        borderColor: '#FFF',
        marginVertical:30,
    },
    matchName:{
        fontSize:26,
        fontWeight:'bold',
        color:'#FFF',
    },
    matchBio:{
        marginTop: 10,
        fontSize: 16,
        color:'rgba(255,255,255,0.8)',
        lineHeight:24,
        textAlign:'center',
        paddingHorizontal:30,
    },
    matchClose:{
        fontSize:16,
        color: 'rgba(255,255,255,0.8)',
        fontWeight:'bold',
        textAlign:'center',
        marginTop:30,
    },
});