package main

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"time"

	"github.com/dgrijalva/jwt-go"
)

const (
	companyKey    = ""
	appKey        = ""
	host          = ""
	rsaPrivateKey = ""
)

func main() {
	companyOpenapi()
	appOpenapi()
}

// 组织级别加密openapi
func companyOpenapi() {
	payload := jwt.MapClaims{
		"iat":        time.Now(),
		"companyKey": companyKey,
	}

	token := rs256Token(payload, rsaPrivateKey)
	listAppResource(token)
}

// 应用级别加密openapi
func appOpenapi() {
	payload := jwt.MapClaims{
		"iat":        time.Now(),
		"companyKey": companyKey,
		"appKey":     appKey,
	}

	token := rs256Token(payload, rsaPrivateKey)
	listAppResource(token)
}

// 请求应用资源列表
func listAppResource(token string) {
	path := "/openapi/company/" + companyKey + "/app/" + appKey + "/resources"

	request, error := http.NewRequest(http.MethodGet, host+path, nil)
	if error != nil {
		fmt.Println(error.Error())
		return
	}
	request.Header.Set("Authorization", "Bearer "+token)

	client := &http.Client{}
	response, err := client.Do(request)
	if error != nil {
		fmt.Println(error.Error())
		return
	}

	defer response.Body.Close()

	respBytes, _ := ioutil.ReadAll(response.Body)
	if err != nil {
		return
	}
	fmt.Println(string(respBytes))
}

// 生成rs256 token
func rs256Token(payload jwt.Claims, rsaPrivateKey string) string {
	pem, err := jwt.ParseRSAPrivateKeyFromPEM([]byte(rsaPrivateKey))
	if err != nil {
		fmt.Println("get rsa private key failed.")
		return ""
	}
	claims := jwt.NewWithClaims(jwt.SigningMethodRS256, payload)

	token, err := claims.SignedString(pem)
	if err != nil {
		fmt.Println("sign jwt token failed.")
		return ""
	}
	return token
}
