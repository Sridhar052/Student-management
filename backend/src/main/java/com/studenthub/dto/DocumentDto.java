package com.studenthub.dto;

import com.studenthub.entity.Document;
import com.studenthub.enums.DocumentStatus;
import java.time.LocalDateTime;

public class DocumentDto {
    private Long id;
    private Long studentId;
    private String documentName;
    private String documentType;
    private String fileUrl;
    private String fileSize;
    private DocumentStatus status;
    private LocalDateTime uploadedDate;

    public DocumentDto() {}

    public DocumentDto(Document doc) {
        this.id = doc.getId();
        if (doc.getStudent() != null) this.studentId = doc.getStudent().getId();
        this.documentName = doc.getDocumentName();
        this.documentType = doc.getDocumentType();
        this.fileUrl = doc.getFileUrl();
        this.fileSize = doc.getFileSize();
        this.status = doc.getStatus();
        this.uploadedDate = doc.getUploadedDate();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }
    public String getDocumentName() { return documentName; }
    public void setDocumentName(String documentName) { this.documentName = documentName; }
    public String getDocumentType() { return documentType; }
    public void setDocumentType(String documentType) { this.documentType = documentType; }
    public String getFileUrl() { return fileUrl; }
    public void setFileUrl(String fileUrl) { this.fileUrl = fileUrl; }
    public String getFileSize() { return fileSize; }
    public void setFileSize(String fileSize) { this.fileSize = fileSize; }
    public DocumentStatus getStatus() { return status; }
    public void setStatus(DocumentStatus status) { this.status = status; }
    public LocalDateTime getUploadedDate() { return uploadedDate; }
    public void setUploadedDate(LocalDateTime uploadedDate) { this.uploadedDate = uploadedDate; }
}
