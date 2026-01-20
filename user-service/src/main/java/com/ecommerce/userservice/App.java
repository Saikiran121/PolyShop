package com.ecommerce.userservice;

import io.javalin.Javalin;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

public class App {
    // Active Users
    private static Map<String, User> users = new ConcurrentHashMap<>();
    // Pending Verification: Email -> { Code, Name, Password }
    private static Map<String, PendingUser> pendingUsers = new ConcurrentHashMap<>();

    public static void main(String[] args) {
        // Pre-populate admin (no verification needed for hardcoded admin in frontend,
        // but good to have)
        users.put("1", new User("1", "Alice", "alice@example.com"));

        Javalin app = Javalin.create(config -> {
            config.plugins.enableCors(cors -> cors.add(it -> {
                it.anyHost();
            }));
        }).start(8085);

        // Get User
        app.get("/users/{email}", ctx -> {
            String email = ctx.pathParam("email");
            User user = users.values().stream()
                    .filter(u -> u.getEmail().equals(email))
                    .findFirst()
                    .orElse(null);

            if (user != null) {
                ctx.json(user);
            } else {
                ctx.status(404).json(Map.of("message", "User not found"));
            }
        });

        // Signup (Start Verification)
        app.post("/users", ctx -> {
            User input = ctx.bodyAsClass(User.class);
            String email = input.getEmail();

            if (users.values().stream().anyMatch(u -> u.getEmail().equals(email))) {
                ctx.status(409).json(Map.of("error", "Email already exists"));
                return;
            }

            // Generate Code
            String code = String.format("%06d", new Random().nextInt(999999));
            pendingUsers.put(email, new PendingUser(input.getName(), email, code));

            // Send Email via Notification Service (PHP)
            sendEmail(email, code);

            ctx.status(202).json(Map.of("message", "Verification code sent", "email", email));
        });

        // Verify Code (Complete Signup)
        app.post("/verify", ctx -> {
            Map<String, String> body = ctx.bodyAsClass(Map.class);
            String email = body.get("email");
            String code = body.get("code");

            PendingUser pending = pendingUsers.get(email);
            if (pending != null && pending.getCode().equals(code)) {
                // Activate User
                String newId = String.valueOf(users.size() + 1);
                users.put(newId, new User(newId, pending.getName(), email));
                pendingUsers.remove(email);

                ctx.status(201).json(Map.of("message", "Verified", "user", users.get(newId)));
            } else {
                ctx.status(400).json(Map.of("error", "Invalid code"));
            }
        });

        System.out.println("User Service running on port 8085");
    }

    private static void sendEmail(String email, String code) {
        new Thread(() -> {
            try {
                String json = String.format(
                        "{\"to\":\"%s\",\"type\":\"email\",\"message\":\"Your verification code is: <b>%s</b>\"}",
                        email, code);

                HttpClient client = HttpClient.newHttpClient();
                HttpRequest request = HttpRequest.newBuilder()
                        .uri(URI.create("http://localhost:8087/notify"))
                        .header("Content-Type", "application/json")
                        .POST(HttpRequest.BodyPublishers.ofString(json))
                        .build();

                client.send(request, HttpResponse.BodyHandlers.ofString());
                System.out.println("Sent verification code to " + email);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }).start();
    }

    // Domain Classes
    public static class User {
        private String id;
        private String name;
        private String email;

        public User() {
        }

        public User(String id, String name, String email) {
            this.id = id;
            this.name = name;
            this.email = email;
        }

        public String getId() {
            return id;
        }

        public String getName() {
            return name;
        }

        public String getEmail() {
            return email;
        }
    }

    public static class PendingUser {
        private String name;
        private String email;
        private String code;

        public PendingUser(String name, String email, String code) {
            this.name = name;
            this.email = email;
            this.code = code;
        }

        public String getName() {
            return name;
        }

        public String getCode() {
            return code;
        }
    }
}
