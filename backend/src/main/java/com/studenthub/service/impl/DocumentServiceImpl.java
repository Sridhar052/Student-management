package com.studenthub.service.impl;

import com.studenthub.dto.DocumentDto;
import com.studenthub.entity.Document;
import com.studenthub.entity.Student;
import com.studenthub.enums.DocumentStatus;
import com.studenthub.exception.ResourceNotFoundException;
import com.studenthub.repository.DocumentRepository;
import com.studenthub.repository.StudentRepository;
import com.studenthub.service.DocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DocumentServiceImpl implements DocumentService {

    @Autowired
    private DocumentRepository documentRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Override
    public List<DocumentDto> getStudentDocuments(Long studentId) {
        return documentRepository.findByStudentId(studentId)
                .stream().map(DocumentDto::new).collect(Collectors.toList());
    }

    @Override
    public List<DocumentDto> getStudentDocumentsByUserId(Long userId) {
        Student student = studentRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));
        return getStudentDocuments(student.getId());
    }

    @Override
    @Transactional
    public DocumentDto addDocument(Long userId, String name, String type, String fileUrl, String fileSize) {
        Student student = studentRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));

        Document doc = new Document();
        doc.setStudent(student);
        doc.setDocumentName(name);
        doc.setDocumentType(type != null ? type : "COLLEGE_DOCUMENT");
        doc.setFileUrl(fileUrl != null ? fileUrl : "https://tctecdannkhtjgxuwyol.supabase.co/storage/v1/object/public/documents/" + name.toLowerCase().replaceAll("\\s+", "_") + ".pdf");
        doc.setFileSize(fileSize != null ? fileSize : "1.2 MB");
        doc.setStatus(DocumentStatus.VERIFIED);

        Document saved = documentRepository.save(doc);
        return new DocumentDto(saved);
    }

    @Override
    public DocumentDto getDocumentById(Long id) {
        Document doc = documentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with ID: " + id));
        return new DocumentDto(doc);
    }

    @Override
    @Transactional
    public void deleteDocument(Long id) {
        Document doc = documentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with ID: " + id));
        documentRepository.delete(doc);
    }
}
