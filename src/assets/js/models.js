/**
 * Simple pendulum acceleration equation
 * 
 * @param {Number} g - Gravity
 * @param {Number} t - Time
 * @param {Number} d - Damping
 * @param {Number} m - Mass
 * @param {Number} l - Length
 * @param {Number} x - Angle
 * @param {Number} v - Velocity
 * @return Pendulum acceleration
 */
export function simplePendulum(g, t, d, m, l, x, v) {
    return - g * Math.sin(x) / l - d / m * v;
}

/**
 * Simple pendulum potential energy
 * 
 * @param {Number} g - Gravity
 * @param {Number} m - Mass
 * @param {Number} l - Length
 * @param {Number} x - Angle 
 * @return Potential energy
 */
export function simEnergyP(g, m, l, x) {
    return m * g * l * (1 - Math.cos(x));
}

/**
 * Simple pendulum kinetic energy
 * 
 * @param {Number} m - Mass
 * @param {Number} x - Angle 
 * @param {Number} v - Velocity 
 * @return Kinetic energy
 */
export function simEnergyK(m, l, v) {
    return 0.5 * m * Math.pow(l, 2) * Math.pow(v, 2);
}

/**
 * Spring pendulum acceleration equations
 * 
 * @param {Number} eq - Equation selector. Ball: 1, Spring: 2
 * @param {Number} g - Gravity
 * @param {Number} t - Time
 * @param {Number} d - Damping
 * @param {Number} m - Mass
 * @param {Number} l - Length
 * @param {Number} k - Stiffness
 * @param {Number} x1 - Angle
 * @param {Number} v1 - Velocity
 * @param {Number} x2 - Elongation
 * @param {Number} v2 - Elongation velocity
 * @return Pendulum acceleration
 */
export function springPendulum(eq, g, t, d, m, l, k, x1, v1, x2, v2) {

    // Ball motion equation
    let b1 = g * Math.sin(x1);
    let b2 = 2 * v2 * v1;
    let b3 = (l + x2);
    let ball = (- b1 - b2) / b3 - d / m * v1;

    // Spring motion equation
    let s1 = (l + x2) * Math.pow(v1, 2);
    let s2 = g * Math.cos(x1);
    let s3 = k * x2 / m
    let spring = s1 + s2 - s3 - d / m * v2;

    let result;
    switch (eq) {
        case 1: result = ball; break;
        case 2: result = spring; break;
        default: result = ball;
    }
    return result;
}

/**
 * Spring pendulum potential energy
 * 
 * @param {Number} g - Gravity
 * @param {Number} m - Mass
 * @param {Number} l - Length
 * @param {Number} k - Stiffness
 * @param {Number} x1 - Angle
 * @param {Number} x2 - Elongation
 * @return Potential energy
 */
export function sprEnergyP(g, m, l, k, x1, x2) {
    return m * g * (l + x2) * Math.cos(x1) + 0.5 * k * Math.pow(x2, 2);
}

/**
 * Spring pendulum kinetic energy
 * 
 * @param {Number} m - Mass
 * @param {Number} l - Length
 * @param {Number} v1 - Velocity
 * @param {Number} x2 - Elongation
 * @param {Number} v2 - Elongation velocity
 * @return Kinetic energy
 */
export function sprEnergyK(m, l, v1, x2, v2) {
    return 0.5 * m * (Math.pow(v2, 2) + Math.pow(l + x2, 2) * Math.pow(v1, 2));
}

/**
 * Double pendulum acceleration equations
 * 
 * @param {Number} eq - Equation selector. Top: 1, Bottom: 2
 * @param {Number} g - Gravity
 * @param {Number} t - Time
 * @param {Number} d - Damping
 * @param {Number} m1 - Top pendulum mass
 * @param {Number} l1 - Top pendulum length
 * @param {Number} x1 - Top pendulum angle
 * @param {Number} v1 - Top pendulum velocity
 * @param {Number} m2 - Bottom pendulum mass
 * @param {Number} l2 - Bottom pendulum length
 * @param {Number} x2 - Bottom pendulum angle
 * @param {Number} v2 - Bottom pendulum velocity
 * @return Pendulum acceleration
 */
export function doublePendulum(eq, g, t, d, m1, l1, x1, v1, m2, l2, x2, v2) {

    // Top pendulum equation
    let t1 = Math.pow(v1, 2) * l1 * m2 * Math.cos(x1 - x2) * Math.sin(x1 - x2);
    let t2 = g * m2 * Math.sin(x2) * Math.cos(x1 - x2);
    let t3 = Math.pow(v2, 2) * l2 * Math.sin(x1 - x2) * m2;
    let t4 = g * (m1 + m2) * Math.sin(x1);
    let t5 = l1 * (m1 + m2) - l1 * m2 * Math.pow(Math.cos(x1 - x2), 2);
    let top = ((- t1 + t2 - t3 - t4) / t5) - d / m1 * v1;

    // Bottom pendulum equation
    let b1 = Math.pow(v2, 2) * l2 * m2 * Math.cos(x1 - x2) * Math.sin(x1 - x2)
    let b2 = g * (m1 + m2) * Math.sin(x1) * Math.cos(x1 - x2)
    let b3 = Math.pow(v1, 2) * l1 * Math.sin(x1 - x2) * (m1 + m2)
    let b4 = g * (m1 + m2) * Math.sin(x2)
    let b5 = l2 * (m1 + m2) - l2 * m2 * Math.pow(Math.cos(x1 - x2), 2)
    let bot = ((b1 + b2 + b3 - b4) / b5) - d / m2 * v2

    let result;
    switch (eq) {
        case 1: result = top; break;
        case 2: result = bot; break;
        default: result = top;
    }
    return result;
}

/**
 * Double pendulum potential energy
 * 
 * @param {Number} g - Gravity
 * @param {Number} m1 - Top pendulum mass
 * @param {Number} l1 - Top pendulum length
 * @param {Number} x1 - Top pendulum angle
 * @param {Number} m2 - Bottom pendulum mass
 * @param {Number} l2 - Bottom pendulum length
 * @param {Number} x2 - Bottom pendulum angle
 * @return Potential energy
 */
export function dblEnergyP(g, m1, l1, x1, m2, l2, x2) {
    let topEP = - (m1 + m2) * g * l1 * Math.cos(x1);
    let botEP = - m2 * g * l2 * Math.cos(x2);
    return topEP + botEP;
}

/**
 * Double pendulum kinetic energy
 * 
 * @param {Number} m1 - Top pendulum mass
 * @param {Number} l1 - Top pendulum length
 * @param {Number} x1 - Top pendulum angle
 * @param {Number} v1 - Top pendulum velocity
 * @param {Number} m2 - Bottom pendulum mass
 * @param {Number} l2 - Bottom pendulum length
 * @param {Number} x2 - Bottom pendulum angle
 * @param {Number} v2 - Bottom pendulum velocity
 * @return Kinetic energy
 */
export function dblEnergyK(m1, l1, x1, v1, m2, l2, x2, v2) {
    let topEK = 0.5 * m1 * Math.pow(l1, 2) * Math.pow(v1, 2);
    let botEK = 0.5 * m2 * (Math.pow(l1, 2) * Math.pow(v1, 2) + Math.pow(l2, 2) * Math.pow(v2, 2) + 2 * l1 * l2 * v1 * v2 * Math.cos(x1 - x2));
    return topEK + botEK;
}

/**
 * Triple pendulum acceleration equations
 * 
 * @param {Number} eq - Equation selector. Amplitude: 1, Rotation: 2
 * @param {Number} g - Gravity
 * @param {Number} t - Time
 * @param {Number} d - Damping
 * @param {Number} m1 - Top pendulum mass
 * @param {Number} l1 - Top pendulum length
 * @param {Number} x1 - Top pendulum angle
 * @param {Number} v1 - Top pendulum velocity
 * @param {Number} m2 - Middle pendulum mass
 * @param {Number} l2 - Middle pendulum length
 * @param {Number} x2 - Middle pendulum angle
 * @param {Number} v2 - Middle pendulum velocity
 * @param {Number} m3 - Bottom pendulum mass
 * @param {Number} l3 - Bottom pendulum length
 * @param {Number} x3 - Bottom pendulum angle
 * @param {Number} v3 - Bottom pendulum velocity
 * @return Pendulum acceleration
 */
export function triplePendulum(eq, g, t, d, m1, l1, x1, v1, m2, l2, x2, v2, m3, l3, x3, v3) {

    let w1 = v1 * d // DAMPING
    let a1 = g * (m1 + m2 + m3) * Math.sin(x1)
    let b1 = l2 * (m2 + m3) * Math.sin(x1 - x2) * Math.pow(v2, 2)
    let c1 = l3 * m3 * Math.sin(x1 - x3) * Math.pow(v3, 2)
    let d1 = (l1 * m1 + (m2 + m3) * l1) //* acc1 
    let e1 = (m2 + m3) * l2 * Math.cos(x1 - x2) //* acc2
    let f1 = l3 * m3 * Math.cos(x1 - x3) //* acc3

    let w2 = v2 * d // DAMPING
    let a2 = l1 * (m2 + m3) * Math.sin(x1 - x2) * Math.pow(v1, 2)
    let b2 = l3 * m3 * Math.sin(x2 - x3) * Math.pow(v3, 2)
    let c2 = (m2 + m3) * g * Math.sin(x2)
    let d2 = (m2 + m3) * l1 * Math.cos(x1 - x2)// * acc1
    let e2 = (m2 + m3) * l2// * acc2
    let f2 = l3 * m3 * Math.cos(x2 - x3)// * acc3

    let w3 = v3 * d // g
    let a3 = m3 * g * Math.sin(x3)
    let b3 = m3 * l1 * Math.sin(x1 - x3) * Math.pow(v1, 2)
    let c3 = m3 * l2 * Math.sin(x2 - x3) * Math.pow(v2, 2)
    let d3 = m3 * l1 * Math.cos(x1 - x3) //* acc1
    let e3 = m3 * l2 * Math.cos(x2 - x3) //* acc2
    let f3 = m3 * l3 //* acc3

    // Top pendulum equation
    let top = -((e3 * f2 - e2 * f3) * a1 + (e3 * f2 - e2 * f3) * b1 + (e3 * f2 - e2 * f3) * c1
        - ((a3 - b3 - c3 + w3) * f2 + a2 * f3 - b2 * f3 - c2 * f3 - f3 * w2) * e1 + ((a3 -
            b3 - c3 + w3) * e2 + a2 * e3 - b2 * e3 - c2 * e3 - e3 * w2) * f1 + (e3 * f2 -
                e2 * f3) * w1) / ((e3 * f2 - e2 * f3) * d1 - (d3 * f2 - d2 * f3) * e1 + (d3 * e2 -
                    d2 * e3) * f1);

    // Middle pendulum equation
    let mid = ((d3 * f2 - d2 * f3) * a1 + (d3 * f2 - d2 * f3) * b1 + (d3 * f2 -
        d2 * f3) * c1 - ((a3 - b3 - c3 + w3) * f2 + a2 * f3 - b2 * f3 - c2 * f3 - f3 * w2) * d1
        + ((a3 - b3 - c3 + w3) * d2 + a2 * d3 - b2 * d3 - c2 * d3 - d3 * w2) * f1 + (d3 * f2 -
            d2 * f3) * w1) / ((e3 * f2 - e2 * f3) * d1 - (d3 * f2 - d2 * f3) * e1 + (d3 * e2 -
                d2 * e3) * f1);

    // Bottom pendulum equation
    let bot = -((d3 * e2 - d2 * e3) * a1 + (d3 * e2 - d2 * e3) * b1 + (d3 * e2 -
        d2 * e3) * c1 - ((a3 - b3 - c3 + w3) * e2 + a2 * e3 - b2 * e3 - c2 * e3 - e3 * w2) * d1
        + ((a3 - b3 - c3 + w3) * d2 + a2 * d3 - b2 * d3 - c2 * d3 - d3 * w2) * e1 + (d3 * e2 -
            d2 * e3) * w1) / ((e3 * f2 - e2 * f3) * d1 - (d3 * f2 - d2 * f3) * e1 + (d3 * e2 -
                d2 * e3) * f1);

    let result;
    switch (eq) {
        case 1: result = top; break;
        case 2: result = mid; break;
        case 3: result = bot; break;
        default: result = top;
    }
    return result;
}

/**
 * Triple pendulum potential energy
 * 
 * @param {Number} g - Gravity
 * @param {Number} m1 - Top pendulum mass
 * @param {Number} l1 - Top pendulum length
 * @param {Number} x1 - Top pendulum angle
 * @param {Number} m2 - Middle pendulum mass
 * @param {Number} l2 - Middle pendulum length
 * @param {Number} x2 - Middle pendulum angle
 * @param {Number} m3 - Bottom pendulum mass
 * @param {Number} l3 - Bottom pendulum length
 * @param {Number} x3 - Bottom pendulum angle
 * @return Potential energy
 */
export function trpEnergyP(g, m1, l1, x1, m2, l2, x2, m3, l3, x3) {
    let a = g * (l1 + l2 + l3) * (m1 + m2 + m3);
    let b = - g * l1 * (m1 + m2 + m3) * Math.cos(x1);
    let c = - g * l2 * (m2 + m3) * Math.cos(x2);
    let d = - g * l3 * m3 * Math.cos(x3);
    return a + b + c + d;
}

/**
 * Triple pendulum kinetic energy
 * 
 * @param {Number} m1 - Top pendulum mass
 * @param {Number} l1 - Top pendulum length
 * @param {Number} x1 - Top pendulum angle
 * @param {Number} v1 - Top pendulum velocity
 * @param {Number} m2 - Middle pendulum mass
 * @param {Number} l2 - Middle pendulum length
 * @param {Number} x2 - Middle pendulum angle
 * @param {Number} v2 - Middle pendulum velocity
 * @param {Number} m3 - Bottom pendulum mass
 * @param {Number} l3 - Bottom pendulum length
 * @param {Number} x3 - Bottom pendulum angle
 * @param {Number} v3 - Bottom pendulum velocity
 * @return Kinetic energy
 */
export function trpEnergyK(m1, l1, x1, v1, m2, l2, x2, v2, m3, l3, x3, v3) {
    let a = Math.pow(l1, 2) * Math.pow(v1, 2);
    let b = a + Math.pow(l2, 2) * Math.pow(v2, 2) + 2 * l1 * l2 * Math.pow(v1, 2) * Math.pow(v2, 2) * Math.cos(x1 - x2);
    let c = b + Math.pow(l3, 2) * Math.pow(v3, 2) + 2 * l1 * l3 * v1 * v3 * Math.cos(x1 - x3) + 2 * l2 * l3 * v2 * v3 * Math.cos(x2 - x3)
    return (0.5 * m1 * a) + (0.5 * m2 * b) + (0.5 * m3 * c);
}

/**
 * Spherical pendulum acceleration equations
 * 
 * @param {Number} g - Gravity
 * @param {Number} t - Time
 * @param {Number} d - Damping
 * @param {Number} m - Mass
 * @param {Number} l - Length
 * @param {Number} x1 - Amplitude angle 
 * @param {Number} v1 - Amplitude velocity
 * @param {Number} x2 - Rotation angle
 * @param {Number} v2 - Rotation velocity
 * @return Pendulum acceleration
 */
export function sphericalPendulum(eq, g, t, d, m, l, x1, v1, x2, v2) {

    // Amplitude variation equation      
    let amp = Math.pow(v2, 2) * Math.sin(x1) * Math.cos(x1) - g * Math.sin(x1) / l

    // Rotation variation equation
    let rot = -2 * v1 * v2 / Math.tan(x1)

    let result;
    switch (eq) {
        case 1: result = amp; break;
        case 2: result = rot; break;
        default: result = amp;
    }
    return result;
}

/**
 * Spherical pendulum potential energy
 * 
 * @param {Number} g - Gravity
 * @param {Number} m - Mass
 * @param {Number} l - Length
 * @param {Number} x1 - Amplitude angle 
 * @return Potential energy
 */
export function sphEnergyP(g, m, l, x1) {
    return -m * g * l * Math.cos(x1);
}

/**
 * Spherical pendulum kinetic energy
 * 
 * @param {Number} m - Mass
 * @param {Number} l - Length
 * @param {Number} x1 - Amplitude angle 
 * @param {Number} v1 - Amplitude velocity 
 * @param {Number} v2 - Rotational velocity 
 * @return Kinetic energy
 */
export function sphEnergyK(m, l, x1, v1, v2) {
    return 0.5 * m * Math.pow(l, 2) * (Math.pow(v1, 2) + Math.pow(Math.sin(x1), 2) * Math.pow(v2, 2));
}