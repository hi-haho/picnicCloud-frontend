<template>
    <div id="myPageMain">
        <div id="buttonArea">
            <router-link to="/">내 정보</router-link>
            <router-link to="">내 게시글</router-link>
            <router-link to="">내 찜</router-link>
        </div>
        <div id="contentsArea">
            <h3>내 정보</h3>
            아이디 <input type="text"/> <br/><br/>
            닉네임  <input type="text"/> <br/><br/>
            비밀번호 <input type="password"/><br/><br/>
            이메일주소 <input type="email"><br/><br/>
            주소  <input type="text"><br/><br/>
            <button>수정</button>
        </div>

    </div>
</template>