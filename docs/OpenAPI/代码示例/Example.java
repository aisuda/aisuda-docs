
import org.jose4j.json.JsonUtil;
import org.jose4j.jws.AlgorithmIdentifiers;
import org.jose4j.jws.JsonWebSignature;
import org.jose4j.lang.JoseException;
import sun.security.util.DerInputStream;
import sun.security.util.DerValue;

import java.io.IOException;
import java.math.BigInteger;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.security.GeneralSecurityException;
import java.security.KeyFactory;
import java.security.PrivateKey;
import java.security.spec.RSAPrivateCrtKeySpec;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

/**
 * 爱速搭 OPENAPI 请求示例
 *
 * 加密依赖：org.bitbucket.b_c:jose4j
 */
public class Example {

    private static final String HOST = "";
    private static final String COMPANY_KEY = "";
    private static final String APP_KEY = "";
    private static final String PRIVATE_KEY = "";

    public static void main(String[] args) {
        // 组织级别加密openapi
        companyOpenapi();
        // 应用级别加密openapi
        appOpenapi();
    }

    /**
     * 组织级别openapi
     */
    private static void companyOpenapi() {
        Map<String, Object> payload = new HashMap<>();
        payload.put("companyKey", COMPANY_KEY);
        payload.put("iat", System.currentTimeMillis() / 1000);
        String token = createJwtTokenByRs256(JsonUtil.toJson(payload), PRIVATE_KEY);
        listDataModel(token);
    }

    /**
     * 应用级别openapi
     */
    private static void appOpenapi() {
        Map<String, Object> payload = new HashMap<>();
        payload.put("companyKey", COMPANY_KEY);
        payload.put("appKey", APP_KEY);
        payload.put("iat", System.currentTimeMillis() / 1000);
        String token = createJwtTokenByRs256(JsonUtil.toJson(payload), PRIVATE_KEY);
        listDataModel(token);
    }

    /**
     * 获取应用下的所有资源
     */
    private static void listDataModel(String token) {
        String path = "/openapi/company/" + COMPANY_KEY + "/app/" + APP_KEY + "/resources";
        HttpClient client = HttpClient.newBuilder().build();

        HttpRequest request = HttpRequest.newBuilder().GET().uri(URI.create(HOST + path))
                .header("Authorization", "Bearer " + token).build();

        HttpResponse.BodyHandler<String> AS_STRING = HttpResponse.BodyHandlers.ofString();
        try {
            HttpResponse<String> response = client.send(request, AS_STRING);
            System.out.println(response);
            System.out.println(response.body());
        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
        }
    }

    /**
     * 使用RS256加密生成JWT token
     */
    private static String createJwtTokenByRs256(String payload, String key) {
        JsonWebSignature jws = new JsonWebSignature();
        PrivateKey privateKey = getPrivateKey(key);
        jws.setHeader("typ", "JWT");
        jws.setAlgorithmHeaderValue(AlgorithmIdentifiers.RSA_USING_SHA256);
        jws.setKey(privateKey);
        jws.setPayload(payload);
        try {
            return jws.getCompactSerialization();
        } catch (JoseException e) {
            throw new RuntimeException("加密失败", e);
        }
    }

    /**
     * 获取RSA私钥
     */
    private static PrivateKey getPrivateKey(String rsakey) {

        String privKeyPEM = rsakey
                .replaceAll("\\-*BEGIN.*KEY\\-*", "")
                .replaceAll("\\-*END.*KEY\\-*", "");

        // Base64 decode the data
        byte[] decoded = Base64.getMimeDecoder().decode(privKeyPEM);

        try {
            DerInputStream derReader = new DerInputStream(decoded);
            DerValue[] seq = derReader.getSequence(0);

            if (seq.length < 9) {
                throw new GeneralSecurityException("Could not read private key");
            }

            // skip version seq[0];
            BigInteger modulus = seq[1].getBigInteger();
            BigInteger publicExp = seq[2].getBigInteger();
            BigInteger privateExp = seq[3].getBigInteger();
            BigInteger primeP = seq[4].getBigInteger();
            BigInteger primeQ = seq[5].getBigInteger();
            BigInteger expP = seq[6].getBigInteger();
            BigInteger expQ = seq[7].getBigInteger();
            BigInteger crtCoeff = seq[8].getBigInteger();

            RSAPrivateCrtKeySpec keySpec = new RSAPrivateCrtKeySpec(modulus, publicExp, privateExp,
                    primeP, primeQ, expP, expQ, crtCoeff);

            KeyFactory factory = KeyFactory.getInstance("RSA");
            return factory.generatePrivate(keySpec);
        } catch (IOException | GeneralSecurityException e) {
            e.printStackTrace();
        }
        return null;
    }
}
