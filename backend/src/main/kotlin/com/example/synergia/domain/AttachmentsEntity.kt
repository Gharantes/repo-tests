package com.example.synergia.domain

import com.example.synergia.utils.enums.AttachmentTypeEnum
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table

@Entity
@Table(name = "attachments")
class AttachmentsEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) var id: Long? = null

    @Column(name = "id_tenant", nullable = false)
    var idTenant: Long? = null

    @Column(name = "url", nullable = false)
    var url: String? = null

    @Column(name = "attachment_type", nullable = false)
    @Enumerated(EnumType.ORDINAL)
    var attachmentType: AttachmentTypeEnum? = null
}