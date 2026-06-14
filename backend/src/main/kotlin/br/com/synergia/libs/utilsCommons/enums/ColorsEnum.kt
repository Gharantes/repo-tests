package br.com.synergia.libs.utilsCommons.enums

enum class ColorsEnum(val hex: String) {
    PINK("#FFB3BA"),
    PEACH("#FFD9B3"),
    YELLOW("#FFFFB3"),
    MINT("#B3FFB3"),
    SKY_BLUE("#B3D9FF"),
    LAVENDER("#D9B3FF"),
    ROSE("#FFB3E6"),
    AQUA("#B3FFF0"),
    APRICOT("#FFE4B3"),
    PERIWINKLE("#C5B3FF"),
    SEAFOAM("#B3FFCC"),
    SALMON("#FF9E9E"),
    CORNFLOWER("#9EC8FF"),
    MANGO("#FFDA9E"),
    TURQUOISE("#9EFFDA"),
    ORCHID("#FF9EDB"),
    BLUEBELL("#9EBAFF"),
    LIME("#D4FF9E"),
    TERRACOTTA("#FFB59E"),
    CYAN("#9EFFFF");

    companion object {
        fun random(): ColorsEnum = entries.random()
        fun randomHex(): String = entries.random().hex
    }
}