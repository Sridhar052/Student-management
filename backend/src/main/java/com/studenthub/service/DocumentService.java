package com.studenthub.service;

import com.studenthub.dto.DocumentDto;
import java.util.List;

public interface DocumentService {
    List<DocumentDto> getStudentDocuments(Long studentId);
    List<DocumentDto> getStudentDocumentsByUserId(Long userId);
    DocumentDto addDocument(Long userId, String name, String type, String fileUrl, String fileSize);
    DocumentDto getDocumentById(Long id);
    void deleteDocument(Long id);
}
