package com.example.synergia.repositories

import com.example.synergia.domain.Event
import org.hibernate.annotations.Parameter
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface EventRepository : JpaRepository<Event, Long> {
    fun findByIdTenantAndId(idTenant: Long, id: Long): Event?

    fun findAllByIdTenant(idTenant: Long): List<Event>
    fun findAllByIdTenantAndTitleLikeIgnoreCaseOrDescriptionLikeIgnoreCase(
        idTenant: Long,
        title: String?,
        description: String?
    ): List<Event>

    @Query("""
        SELECT e FROM Event e 
        WHERE 
            e.idTenant = :idTenant AND 
            CASE WHEN :textSearch is null THEN TRUE ELSE (
                LOWER(e.title) LIKE CONCAT('%', LOWER(:textSearch), '%') OR 
                LOWER(e.description) LIKE CONCAT('%', LOWER(:textSearch), '%')
            ) END
    """)
    fun findAllByIdTenantAndText(
        @Param("idTenant") idTenant: Long,
        @Param("textSearch") textSearch: String?
    ): List<Event>

    fun deleteByIdTenantAndId(idTenant: Long, id: Long)
}
