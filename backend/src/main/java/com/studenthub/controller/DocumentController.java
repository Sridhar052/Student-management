package com.studenthub.controller;

import com.studenthub.dto.ApiResponse;
import com.studenthub.dto.DocumentDto;
import com.studenthub.security.UserPrincipal;
import com.studenthub.service.DocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class DocumentController {

    @Autowired
    private DocumentService documentService;

    @GetMapping("/students/me/documents")
    public ResponseEntity<ApiResponse<List<DocumentDto>>> getMyDocuments(@AuthenticationPrincipal UserPrincipal currentUser) {
        List<DocumentDto> docs = documentService.getStudentDocumentsByUserId(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Documents retrieved successfully", docs));
    }

    @PostMapping("/students/me/documents")
    public ResponseEntity<ApiResponse<DocumentDto>> addDocument(@AuthenticationPrincipal UserPrincipal currentUser,
                                                               @RequestParam String name,
                                                               @RequestParam(required = false) String type,
                                                               @RequestParam(required = false) String fileUrl,
                                                               @RequestParam(required = false) String fileSize) {
        DocumentDto doc = documentService.addDocument(currentUser.getId(), name, type, fileUrl, fileSize);
        return ResponseEntity.ok(ApiResponse.success("Document added successfully", doc));
    }

    @DeleteMapping("/documents/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteDocument(@PathVariable Long id) {
        documentService.deleteDocument(id);
        return ResponseEntity.ok(ApiResponse.success("Document deleted successfully", null));
    }
}
