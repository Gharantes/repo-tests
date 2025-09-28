package com.example.synergia.repositories.byDomain

import com.example.synergia.domain.TagsEntity
import org.springframework.data.jpa.repository.JpaRepository

interface TagsRepository : JpaRepository<TagsEntity, Long> {
}