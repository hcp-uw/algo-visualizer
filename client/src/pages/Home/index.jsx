import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import "./Home.css";

// home page
const Home = () => {
    return (
        <div className="centered">
            <div id="logo-container">
                <svg
                    version="1.0"
                    xmlns="http://www.w3.org/2000/svg"
                    width="695.807787pt"
                    height="130.974817pt"
                    viewBox="-3 0 695.807787 121.974817"
                    id="logo"
                >
                    <g
                        transform="translate(-48.137632,284.000000) scale(0.100000,-0.100000)"
                        fill="none"
                        stroke="black"
                    >
                        <g id="a">
                            <path
                                d="M859 2824 c-14 -17 -15 -19 -240 -686 -183 -539 -182 -497 -6 -500
                                    196 -4 216 -3 232 13 14 14 48 126 156 518 22 79 37 152 34 162 -9 26 -52 36
                                    -72 16 -14 -14 -110 -321 -163 -519 l-23 -88 -92 0 -92 0 162 488 162 487 130
                                    3 129 3 71 -233 c94 -305 215 -719 217 -738 1 -12 -15 -16 -73 -18 -41 -2 -78
                                    1 -82 5 -4 4 -19 67 -34 138 -15 72 -34 138 -42 148 -13 13 -32 17 -93 17 -90
                                    0 -123 -17 -122 -64 0 -38 15 -50 75 -56 l52 -5 27 -120 c35 -161 26 -155 238
                                    -155 149 0 169 2 183 18 32 36 29 51 -138 562 -45 140 -104 326 -131 413 -26
                                    87 -56 169 -66 183 -19 24 -21 24 -203 24 -155 0 -185 -2 -196 -16z"
                            />
                        </g>

                        <g id="l">
                            <path
                                d="M1702 2766 c-17 -22 -20 -49 -25 -243 -4 -120 -7 -307 -7 -415 0
                                    -187 1 -199 21 -219 26 -26 66 -22 91 11 17 23 19 54 24 360 3 184 7 350 10
                                    368 5 32 6 33 47 30 l42 -3 5 -498 c5 -462 6 -500 23 -512 25 -18 402 -31 450
                                    -16 48 16 57 44 57 177 0 109 -1 116 -25 139 -23 24 -30 25 -143 25 -105 0
                                    -121 -2 -140 -20 -28 -26 -28 -71 -1 -96 15 -14 40 -20 95 -22 l74 -4 0 -34 0
                                    -35 -127 3 -128 3 -5 498 c-5 479 -6 499 -24 513 -15 10 -54 14 -157 14 -134
                                    0 -138 -1 -157 -24z"
                            />
                        </g>

                        <g id="g">
                            <path
                                id="g1"
                                d="M2903 2825 c-142 -39 -279 -158 -351 -305 -62 -126 -75 -191 -70
                                    -335 6 -149 31 -229 102 -329 144 -199 397 -247 609 -116 27 17 50 30 53 30 2
                                    0 4 -16 4 -35 0 -55 25 -72 118 -80 114 -10 162 10 162 66 0 46 -34 69 -102
                                    69 l-58 0 0 53 c-1 104 -25 157 -72 157 -11 0 -53 -32 -94 -71 -96 -91 -163
                                    -123 -259 -123 -316 -2 -448 457 -215 749 126 159 335 194 483 81 38 -29 99
                                    -110 90 -120 -3 -3 -29 -6 -57 -6 -64 0 -100 -18 -104 -51 -6 -48 27 -64 143
                                    -67 95 -4 105 -2 125 18 71 71 -61 305 -213 380 -102 49 -197 61 -294 35z"
                            />
                            <path
                                id="g2"
                                d="M3065 2310 c-17 -18 -20 -36 -20 -109 0 -47 3 -98 7 -112 10 -35 49
                                    -50 144 -56 79 -5 81 -5 102 22 27 34 27 45 2 78 -16 20 -33 27 -75 32 -37 5
                                    -55 12 -55 21 0 11 21 14 95 14 l95 0 0 -80 c0 -92 12 -124 51 -141 24 -9 33
                                    -9 54 5 13 9 28 28 31 42 8 31 -1 231 -11 257 -14 35 -46 42 -225 45 -170 4
                                    -176 3 -195 -18z"
                            />
                        </g>

                        <g id="o">
                            <path
                                d="M4085 2804 c-138 -21 -288 -108 -370 -217 -220 -289 -127 -727 188
                                    -886 311 -157 689 30 772 381 19 82 19 218 0 293 -37 146 -153 299 -272 363
                                    -96 50 -231 78 -318 66z m221 -173 c247 -116 326 -453 160 -680 -46 -62 -97
                                    -103 -173 -138 -50 -24 -71 -28 -148 -27 -120 0 -184 25 -271 106 -184 173
                                    -191 457 -15 650 113 124 295 160 447 89z"
                            />
                        </g>

                        <g id="v">
                            <path
                                d="M4855 2831 c-141 -10 -156 -27 -136 -154 15 -99 29 -145 52 -168 25
                                    -25 44 -24 70 2 20 20 21 29 16 100 l-5 78 32 6 c18 4 48 5 66 3 l34 -3 88
                                    -384 c56 -245 93 -390 104 -402 22 -24 76 -25 97 -1 13 14 249 646 297 795 15
                                    48 7 82 -25 103 -21 14 -30 14 -55 4 -33 -14 -31 -10 -165 -382 -43 -120 -81
                                    -218 -84 -218 -3 0 -35 129 -71 288 -57 252 -68 290 -92 315 -29 30 -37 30
                                    -223 18z"
                            />
                            <path
                                d="M5565 2366 c-13 -9 -52 -111 -115 -302 l-97 -289 -143 0 -143 0 -13
                                    40 c-7 22 -30 98 -50 168 -49 171 -92 219 -145 166 -29 -29 -23 -79 40 -299
                                    36 -128 56 -180 72 -192 19 -16 46 -18 238 -18 215 0 218 0 239 23 22 24 222
                                    611 222 653 0 26 -40 64 -66 64 -11 0 -29 -6 -39 -14z"
                            />
                        </g>

                        <g id="i">
                            <path
                                d="M5835 2786 c-28 -20 -34 -105 -34 -461 -1 -341 1 -355 57 -355 68 1
                                    70 14 78 384 8 371 -4 329 103 340 66 7 103 29 99 59 -5 36 -44 47 -169 47
                                    -82 0 -121 -4 -134 -14z"
                            />
                            <path
                                d="M6107 2468 c-26 -20 -35 -104 -42 -420 l-7 -286 -104 -4 c-80 -2
                                    -107 -7 -120 -20 -23 -22 -21 -66 4 -91 19 -18 36 -21 159 -25 129 -4 140 -3
                                    164 17 26 20 27 24 33 173 4 84 3 260 -2 390 -7 209 -11 240 -27 258 -21 23
                                    -34 25 -58 8z"
                            />
                        </g>

                        <g id="z">
                            <path
                                id="z1"
                                d="M6490 2798 c-31 -11 -52 -52 -41 -80 5 -13 15 -29 23 -36 10 -8 127
                                    -13 399 -18 l384 -7 28 23 c36 28 34 74 -3 101 -23 17 -57 18 -398 21 -205 2
                                    -382 0 -392 -4z"
                            />
                            <path
                                id="z2"
                                d="M6919 2573 c-61 -64 -69 -75 -357 -489 -267 -383 -275 -400 -231
                                    -440 20 -18 45 -19 473 -22 248 -1 461 0 474 3 41 10 57 85 29 127 -1 1 -181
                                    5 -400 8 l-398 5 221 319 c121 176 237 346 256 378 44 72 55 125 29 144 -31
                                    23 -48 16 -96 -33z"
                            />
                            <path
                                id="z3"
                                d="M7144 2468 c-57 -60 -182 -227 -297 -396 -87 -127 -95 -160 -50 -189
                                    24 -16 58 -18 265 -22 207 -3 242 -1 263 13 30 19 33 55 8 84 -16 19 -34 22
                                    -199 29 l-182 8 114 170 c142 211 194 307 178 332 -21 34 -48 26 -100 -29z"
                            />
                        </g>
                    </g>
                </svg>
            </div>
            <div className="message">
                <p>
                    Welcome! Choose an algorithm to visualize from the drop
                    downs above.
                </p>
            </div>
        </div>
    );
};

export default Home;
