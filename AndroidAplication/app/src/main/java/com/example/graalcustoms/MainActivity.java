package com.example.graalcustoms;

import android.annotation.TargetApi;
import android.content.Intent;
import android.view.View;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebViewClient;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;

import android.Manifest;
import android.app.DownloadManager;
import android.content.Context;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.webkit.URLUtil;
import android.webkit.WebView;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.nio.channels.Channels;
import java.nio.channels.ReadableByteChannel;



import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.util.Base64;
import androidx.core.app.NotificationCompat;



public class MainActivity extends AppCompatActivity {

    String preload_js_code = "document.android_webview_preload_call()";

    static String APLICATION_URL = "https://graalcustoms.vercel.app/app.html";
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        checkPermissions();
        WebView webview = (WebView)findViewById(R.id.webview);
        webview.getSettings().setAllowFileAccess(true);
        webview.getSettings().setAllowContentAccess(true);
        webview.getSettings().setDomStorageEnabled(true);


        if (webview != null) {
            webview.setWebViewClient(new WebViewClient() {
                @Override
                public void onPageFinished(WebView view, String url) {
                    super.onPageFinished(view, url);
                    // Seu código JavaScript aqui, minha flor!
                    webview.evaluateJavascript(preload_js_code, null);
                    webview.setVisibility(View.VISIBLE);
                }


                @SuppressWarnings("deprecation")
                @Override
                public boolean shouldOverrideUrlLoading(WebView view, String url) {
                    if (Uri.parse(url).getHost().equals(APLICATION_URL)) {
                        // Este é o teu domínio, então carrega a URL no WebView
                        return false;
                    }

                    // Caso contrário, a URL não é do teu domínio, então abre no navegador externo
                    Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                    startActivity(intent);
                    return true;
                }

                @TargetApi(Build.VERSION_CODES.N)
                @Override
                public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                    if (request.getUrl().getHost().equals(APLICATION_URL)) {
                        // Este é o teu domínio, então carrega a URL no WebView
                        return false;
                    }

                    // Caso contrário, a URL não é do teu domínio, então abre no navegador externo
                    Intent intent = new Intent(Intent.ACTION_VIEW, request.getUrl());
                    startActivity(intent);
                    return true;
                }

            });


            DownloaderInterface interfaced = new DownloaderInterface();

            webview.setWebChromeClient(new WebChromeClient());


            webview.addJavascriptInterface(interfaced, "Android");



            webview.getSettings().setJavaScriptEnabled(true);
            WebView webView = webview;
            webView.setDownloadListener((url, userAgent, contentDisposition, mimeType, contentLength) -> {
                if (url.startsWith("blob:")) {
                   url = url.substring(5);
                   Toast.makeText(this, url, Toast.LENGTH_LONG).show();
                }
                {
                    DownloadManager.Request request = new DownloadManager.Request(Uri.parse(url));

                    // Configurações para o download
                    request.setMimeType(mimeType);
                    request.addRequestHeader("User-Agent", userAgent);
                    request.setDescription("Download em andamento");
                    request.setTitle(URLUtil.guessFileName(url, contentDisposition, mimeType));
                    request.allowScanningByMediaScanner();
                    request.setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED);

                    // Diretório de destino para o download
                    request.setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS, URLUtil.guessFileName(url, contentDisposition, mimeType));

                    // Inicia o download
                    DownloadManager downloadManager = (DownloadManager) getSystemService(DOWNLOAD_SERVICE);
                    if (downloadManager != null) {
                        downloadManager.enqueue(request);
                    }
                }
            });
            webview.loadUrl(APLICATION_URL);
        }else{
            Toast.makeText(this,"Invalid webview error", Toast.LENGTH_LONG).show();
        }








    }




    public void downloadFile(URL url, String outputFileName) throws IOException {

        try (InputStream in = url.openStream();
             ReadableByteChannel rbc = Channels.newChannel(in);
             FileOutputStream fos = new FileOutputStream(outputFileName)) {
            fos.getChannel().transferFrom(rbc, 0, Long.MAX_VALUE);
        }
        // do your work here

        Toast.makeText(this, "Downloading a file", Toast.LENGTH_LONG).show();

    }



    public void checkPermissions() {
        String requiredPermission = Manifest.permission.WRITE_EXTERNAL_STORAGE;
        String requiredPermission2 = Manifest.permission.READ_EXTERNAL_STORAGE;

        if ( (!hasPermissions(requiredPermission)) || (!hasPermissions(requiredPermission2))) {
            int read_storage = 2;
            Toast.makeText(this, "Please enable write external storage permission.", Toast.LENGTH_LONG).show();

            ActivityCompat.requestPermissions(this,
                    new String[]{Manifest.permission.READ_EXTERNAL_STORAGE, Manifest.permission.WRITE_EXTERNAL_STORAGE},
                    read_storage);
        }

    }


    public boolean hasPermissions( String... permissions) {
        Context context = (Context) this;
        if (android.os.Build.VERSION.SDK_INT >= Build.VERSION_CODES.M && context != null && permissions != null) {
            for (String permission : permissions) {
                if (ActivityCompat.checkSelfPermission(context, permission) != PackageManager.PERMISSION_GRANTED) {
                    return false;
                }
            }
        }
        return true;
    }






    public class DownloaderInterface {


        @JavascriptInterface
        public void save_base64(String content, String name) {
            // Aqui você pode colocar a lógica que quiser
            // Por exemplo, exibir um Toast
            Toast.makeText(MainActivity.this, "Downloading: "+name, Toast.LENGTH_SHORT).show();
            downloadBase64File(MainActivity.this, name, content);
        }
    }

    private static final String CHANNEL_ID = "DownloadChannel";

    public static void downloadBase64File(Context context, String nomeArquivo, String base64Conteudo) {
        try {
            byte[] dadosArquivo = Base64.decode(base64Conteudo, Base64.DEFAULT);

            // Pasta de downloads pública
            File pastaDownloads = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS);
            File arquivo = new File(pastaDownloads, nomeArquivo);

            FileOutputStream outputStream = new FileOutputStream(arquivo);
            outputStream.write(dadosArquivo);
            outputStream.close();

            Toast.makeText(context, "File saved: "+arquivo.getAbsolutePath(), Toast.LENGTH_SHORT).show();


        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private static void show_notification(Context context, String titulo, String mensagem) {
        NotificationManager notificationManager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(CHANNEL_ID, "Download Channel", NotificationManager.IMPORTANCE_DEFAULT);
            notificationManager.createNotificationChannel(channel);
        }

        NotificationCompat.Builder builder = new NotificationCompat.Builder(context, CHANNEL_ID)
                .setSmallIcon(android.R.drawable.stat_sys_download_done)
                .setContentTitle(titulo)
                .setContentText(mensagem)
                .setPriority(NotificationCompat.PRIORITY_DEFAULT);

        Notification notification = builder.build();
        notificationManager.notify(1, notification);
    }
}