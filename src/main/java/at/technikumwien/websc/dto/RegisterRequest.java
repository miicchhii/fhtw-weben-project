package at.technikumwien.websc.dto;

public record RegisterRequest(
        String firstName,
        String lastName,
        String email,
        String username,
        String passwordHash
) {
}
